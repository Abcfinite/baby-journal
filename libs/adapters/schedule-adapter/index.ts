import _ from "lodash"
import S3ClientCustom from '@abcfinite/s3-client-custom'
import { playerNamesToSportEvent, SportEvent } from "@abcfinite/tennislive-client/src/types/sportEvent"
import PlayerAdapter from '@abcfinite/player-adapter'
import { SQSClient, SendMessageCommand,
  ReceiveMessageCommand, GetQueueAttributesCommand,
  DeleteMessageCommand } from "@aws-sdk/client-sqs";
import { toCsv } from "./src/utils/builder"
import BetapiClient from "@abcfinite/betapi-client"

export default class ScheduleAdapter {

  async cacheBetAPI() {
    // delete previous cache
    const s3ClientCustom = new S3ClientCustom()
    await s3ClientCustom.deleteAllFiles('betapi-cache')

    // get latest schedule
    const events = await new BetapiClient().getEvents()

    // safe all players in dynamodb

    // return number of matches
    return `number of matches : ${events.length}`
  }

  async getSchedule() {
    const s3ClientCustom = new S3ClientCustom()
    const currentDateTime = new Date().toLocaleString('en-GB', {timeZone: 'Australia/Sydney'})
    const currentDate = currentDateTime.split(',')[0].trim()

    var requestResult = 'error'
    const resultFile = await s3ClientCustom.getFile('tennis-match-schedule', 'result.json')

    if (resultFile) {
      // if (JSON.parse(resultFile)[0]['date'] === currentDate) {
        return toCsv(resultFile)
      // }
      // // else {
        // await s3ClientCustom.deleteAllFiles('betapi-cache')
        // await s3ClientCustom.deleteAllFiles('tennis-match-schedule')
        // return 'betAPI cache and tennis scheduled cleared'
      // }
    }

    const queueUrl = 'https://sqs.ap-southeast-2.amazonaws.com/146261234111/tennis-match-schedule-queue'
    const client = new SQSClient({ region: 'ap-southeast-2' });

    // const sportEvents = await new TennisliveClient().getSchedule()
    const events = await new BetapiClient().getEvents()

    const sportEvents = []
    events.forEach(event => {
        const eventDateTime = new Date(parseInt(event.time)*1000).toLocaleString('en-GB', {timeZone: 'Australia/Sydney'})
        const sportEvent = playerNamesToSportEvent(event.player1.id, event.player1.name, event.player2.id, event.player2.name)
        sportEvent.id = event.id
        sportEvent.date = eventDateTime.split(',')[0].trim()
        sportEvent.time = eventDateTime.split(',')[1].trim()
        sportEvent.stage = event.stage

        if (sportEvent.date === currentDate && !sportEvent.player1.name.includes('/')) {
          sportEvents.push(sportEvent)
        }

        if (!sportEvent.player1.name.includes('/')) {
          sportEvents.push(sportEvent)
        }
      }
    )

    const fileList = await new S3ClientCustom().getFileList('tennis-match-schedule')
    const fileContent = []

    console.log('>>>>total schedule number: ', sportEvents.length)
    console.log('>>>>checked number: ', fileList.length)

    if (120 < fileList.length) {
    // if (sportEvents.length === fileList.length) {
      await Promise.all(
        fileList.map( async file => {
          const content = await new S3ClientCustom().getFile('tennis-match-schedule', file)
          fileContent.push(JSON.parse(content))
        })
      )

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