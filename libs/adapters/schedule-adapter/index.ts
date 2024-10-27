import _ from "lodash"
import S3ClientCustom from '@abcfinite/s3-client-custom'
import { putItem, executeScan, executeQuery } from '@abcfinite/dynamodb-client'
import { playerNamesToSportEvent, SportEvent } from "@abcfinite/tennislive-client/src/types/sportEvent"
import PlayerAdapter from '@abcfinite/player-adapter'
import { SQSClient, SendMessageCommand,
  ReceiveMessageCommand, GetQueueAttributesCommand,
  DeleteMessageCommand,
  PurgeQueueCommand} from "@aws-sdk/client-sqs";
import { toCsv } from "./src/utils/builder"
import BetapiClient from "@abcfinite/betapi-client"
import TennisliveClient from "@abcfinite/tennislive-client"

export default class ScheduleAdapter {


  async removeAllCache() {
    const s3ClientCustom = new S3ClientCustom()
    await s3ClientCustom.deleteAllFiles('betapi-cache')
    await s3ClientCustom.deleteAllFiles('tennis-match-schedule')

    const queueUrl = 'https://sqs.ap-southeast-2.amazonaws.com/146261234111/tennis-match-schedule-queue'
    const client = new SQSClient({ region: 'ap-southeast-2' });


    const params = {
      QueueUrl: queueUrl, // URL of the queue to be purged
    };

    try {
      const purgeCommand = new PurgeQueueCommand(params);
      await client.send(purgeCommand);
      console.log(`Queue purged: ${queueUrl}`);
    } catch (err) {
      console.error("Error purging queue:", err);
    }

    return 'all cache removed and sqs queue purged'
  }

  async cacheBetAPI() {
    // get latest schedule
    // todo : why need to get result first ??? Is it to warm up the lambda ???
    const s3ClientCustom = new S3ClientCustom()
    await s3ClientCustom.getFile('tennis-match-schedule', 'result.json')

    const events = await new BetapiClient().getEvents()

    // safe all main players in dynamodb
    if (events.length === 0) { return 'no match scheduled' }

    // filter out double
    const filteredEvents = events.map(event => {
      if (!event.player1.name.includes('/')) {
        return event
      }
    }).filter(Boolean)

    // collect putItem function
    const player1s =
      filteredEvents.map(event => {
        const player1 = {
          "id": event.player1.id,
          "full_name": event.player1.name,
          "url_found": true,
        }

        return putItem('tennis_players', player1)
      })


    const player2s =
      filteredEvents.map(event => {
        const player2 = {
          "id": event.player2.id,
          "full_name": event.player2.name,
          "url_found": true,
        }

        return putItem('tennis_players', player2)
      })

    // execute putItem on dynamodb
    await Promise.all(player1s)
    await Promise.all(player2s)

    // return number of matches
    return `number of matches : ${events.length}`
  }

  async getPlayersName() {
    const queueUrl = 'https://sqs.ap-southeast-2.amazonaws.com/146261234111/tennis-player-url-queue'
    const client = new SQSClient({ region: 'ap-southeast-2' });

    // purge player name on queue
    const params = {
      QueueUrl: queueUrl, // URL of the queue to be purged
    };

    try {
      const purgeCommand = new PurgeQueueCommand(params);
      await client.send(purgeCommand);
      console.log(`Queue purged: ${queueUrl}`);
    } catch (err) {
      console.error("Error purging queue:", err);
    }

    // get all player from dynamodb that
    // does not have url and found is true
    const scanParam = {
      FilterExpression: 'url_found = :url_found AND attribute_not_exists(tennislive_url)',
      ExpressionAttributeValues: {
        ':url_found': { BOOL: true },
      },
      ProjectionExpression: 'id, full_name, url_found, tennislive_url',
      TableName: 'tennis_players',
    }
    const result = await executeScan(scanParam)

    // if url is not exist then push name to sqs
    result['Items'].forEach(async item => {
      const input = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify({
          id: item['id']['S'],
          url_found: item['url_found']['BOOL'],
          full_name: item['full_name']['S']
        }),
        DelaySeconds: 10,
      };
      const command = new SendMessageCommand(input);
      await client.send(command);
    })

    return `${result['Count']} players on queue.`
  }

  async getPlayersUrl() {
    const queueUrl = 'https://sqs.ap-southeast-2.amazonaws.com/146261234111/tennis-player-url-queue'
    const client = new SQSClient({ region: 'ap-southeast-2' });

    // check queue in SQS
    const getQueueAttrCommand = new GetQueueAttributesCommand({
      QueueUrl: queueUrl,
      AttributeNames: ['All']
    });

    var getQueueAttrCommandResponse = await client.send(getQueueAttrCommand);
    var sqsMessageNumber = Number(getQueueAttrCommandResponse.Attributes.ApproximateNumberOfMessages)


    while(sqsMessageNumber > 0) {
      const receiveMessageCommand  = new ReceiveMessageCommand({
        MaxNumberOfMessages: 1,
        MessageAttributeNames: ["All"],
        QueueUrl: queueUrl,
        WaitTimeSeconds: 20,
        VisibilityTimeout: 20,
      })

      const receiveMessageCommandResult = await client.send(receiveMessageCommand);
      var player = JSON.parse(receiveMessageCommandResult.Messages[0].Body)

      var tennisLiveUrl = await new TennisliveClient().getPlayerUrl(player['full_name'])

      var urlFound = true
      if (tennisLiveUrl === null || tennisLiveUrl === undefined || tennisLiveUrl === 'too many result') {
        tennisLiveUrl = 'not found'
        urlFound = false
      }

      // insert to dynamodb
      const player1 = {
        id : player['id'],
        full_name : player['full_name'],
        url_found : urlFound,
        tennislive_url: tennisLiveUrl
      }

      await putItem('tennis_players', player1, true)

      await client.send(
        new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: receiveMessageCommandResult.Messages[0].ReceiptHandle,
        }),
      );

      getQueueAttrCommandResponse = await client.send(getQueueAttrCommand);
      sqsMessageNumber = Number(getQueueAttrCommandResponse.Attributes.ApproximateNumberOfMessages)
    }

    return `${sqsMessageNumber} players on queue.`
  }

  async getSchedule() {
    const s3ClientCustom = new S3ClientCustom()
    const currentDateTime = new Date().toLocaleString('en-GB', {timeZone: 'Australia/Sydney'})
    const currentDate = currentDateTime.split(',')[0].trim()

    var requestResult = 'error'
    const resultFile = await s3ClientCustom.getFile('tennis-match-schedule', 'result.json')

    if (resultFile) {
        return toCsv(resultFile)
    }

    const queueUrl = 'https://sqs.ap-southeast-2.amazonaws.com/146261234111/tennis-match-schedule-queue'
    const client = new SQSClient({ region: 'ap-southeast-2' });

    // const sportEvents = await new TennisliveClient().getSchedule()
    const events = await new BetapiClient().getEvents()

    const sportEvents = []

    // events.forEach(async event => {
    for await (const event of events) {
      const eventDateTime = new Date(parseInt(event.time)*1000).toLocaleString('en-GB', {timeZone: 'Australia/Sydney'})
      const eventDate = eventDateTime.split(',')[0].trim()

      console.log('>>>>>eventDate')
      console.log(eventDate)

      if (event.player1.name.includes('/')) {
        continue
      }

      if (eventDate !== '27/10/2024') {
        continue
      }

      console.log('>>>continue to get player url')

      const query1 = {
        KeyConditionExpression: '#id = :id',
        ExpressionAttributeNames: {
            '#id': 'id'
        },
        ExpressionAttributeValues: {
            ':id': { S: event.player1.id }
        },
        ProjectionExpression: 'id, full_name, url_found, tennislive_url',
        TableName: 'tennis_players',
      }
      const result1 = await executeQuery(query1)

      const query2 = {
        KeyConditionExpression: '#id = :id',
        ExpressionAttributeNames: {
            '#id': 'id'
        },
        ExpressionAttributeValues: {
            ':id': { S: event.player2.id }
        },
        ProjectionExpression: 'id, full_name, url_found, tennislive_url',
        TableName: 'tennis_players',
      }

      const result2 = await executeQuery(query2)

      const p1Record = result1.Items[0]
      const p2Record = result2.Items[0]

      if (!(p1Record['url_found']['BOOL'] && p2Record['url_found']['BOOL'])) {
        continue
      }

      const sportEvent = playerNamesToSportEvent(event.player1.id,
        p1Record['tennislive_url']['S'],
        event.player1.name,
        p2Record['tennislive_url']['S'],
        event.player2.id,
        event.player2.name,
      )

      console.log('>>>>>detail')
      console.log(sportEvent)

      sportEvent.id = event.id
      sportEvent.date = eventDateTime.split(',')[0].trim()
      sportEvent.time = eventDateTime.split(',')[1].trim()
      sportEvent.stage = event.stage

      sportEvents.push(sportEvent)
    }

    const fileList = await new S3ClientCustom().getFileList('tennis-match-schedule')
    const fileContent = []

    console.log('>>>>total schedule number: ', sportEvents.length)
    console.log('>>>>checked number: ', fileList.length)

    if (sportEvents.length > 0 && sportEvents.length === fileList.length) {
      await Promise.all(
        fileList.map( async file => {
          const content = await new S3ClientCustom().getFile('tennis-match-schedule', file)
          fileContent.push(JSON.parse(content))
        })
      )

      fileContent.forEach(content => {
        var parsed = null

        try {
          parsed = JSON.parse(content)
          fileContent.push(parsed)
        } catch(ex) {
          console.error('>>>>>failed to parse content')
          return
        }
      })

      /// by gap
      const filtered = fileContent.filter(e => {
        const wlP1 = _.get(e, 'analysis.winLoseRanking.player1', 0)
        const wlP2 = _.get(e, 'analysis.winLoseRanking.player2', 0)

        return wlP1 !== wlP2
      })

      const sorted = filtered.sort((a,b) => {
        const gapA = _.get(a, 'analysis.gap', 0)
        const gapB = _.get(b, 'analysis.gap', 0)

        return gapB - gapA
      })

      await new S3ClientCustom()
        .putFile('tennis-match-schedule','result.json', JSON.stringify(sorted))

      return sorted
    }


    // check queue in SQS
    const getQueueAttrCommand = new GetQueueAttributesCommand({
      QueueUrl: queueUrl,
      AttributeNames: ['All']
    });

    var getQueueAttrCommandResponse = await client.send(getQueueAttrCommand);
    var sqsMessageNumber = Number(getQueueAttrCommandResponse.Attributes.ApproximateNumberOfMessages)

    if (sqsMessageNumber === 0) {
      // get schedule and put it in the SQS
      // this part will not timeout
      await Promise.all(
        sportEvents.map(async sporte => {

          // console.log('>>>>push to sqs>>>')
          // console.log(sporte)

          const input = {
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify(sporte),
            DelaySeconds: 10,
          };
          const command = new SendMessageCommand(input);
          await client.send(command);
        })
      )

      return 'message queue successfully'

    } else {
      // loop while sqs has message
      // this part might timeout after 15mins
      while(sqsMessageNumber > 0) {
        const receiveMessageCommand  = new ReceiveMessageCommand({
          MaxNumberOfMessages: 1,
          MessageAttributeNames: ["All"],
          QueueUrl: queueUrl,
          WaitTimeSeconds: 20,
          VisibilityTimeout: 20,
        })

        const receiveMessageCommandResult = await client.send(receiveMessageCommand);
        var sportEvent = JSON.parse(receiveMessageCommandResult.Messages[0].Body)

        try {
          var checkPlayerResult = await new PlayerAdapter().checkSportEvent(sportEvent)

          await new S3ClientCustom()
            .putFile('tennis-match-schedule',
            sportEvent.id+'.json',
              JSON.stringify(checkPlayerResult))
        } catch(ex) {
          console.error('>>>>>check sport event parse error>>>', sportEvent.id)
          console.error(ex)
          await new S3ClientCustom()
            .putFile('tennis-match-schedule',
            sportEvent.id+'.json',
              JSON.stringify(sportEvent))
        }

        await client.send(
          new DeleteMessageCommand({
            QueueUrl: queueUrl,
            ReceiptHandle: receiveMessageCommandResult.Messages[0].ReceiptHandle,
          }),
        );

        getQueueAttrCommandResponse = await client.send(getQueueAttrCommand);
        sqsMessageNumber = Number(getQueueAttrCommandResponse.Attributes.ApproximateNumberOfMessages)
      }
    }

    return requestResult
  }
}