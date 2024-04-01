import _ from "lodash"
import { putItem } from '@abcfinite/dynamodb-client'
import S3ClientCustom from '@abcfinite/s3-client-custom'
import TennisliveClient from '@abcfinite/tennislive-client'
import { Player } from '../../clients/tennislive-client/src/types/player'
import { SportEvent } from "@abcfinite/tennislive-client/src/types/sportEvent"
import PlayerAdapter from '@abcfinite/player-adapter'
import { SQSClient, SendMessageCommand,
  ReceiveMessageCommand, GetQueueAttributesCommand,
  DeleteMessageCommand } from "@aws-sdk/client-sqs";

export default class ScheduleAdapter {
  async getSchedule() {
    const queueUrl = 'https://sqs.ap-southeast-2.amazonaws.com/146261234111/tennis-match-schedule-queue'
    const client = new SQSClient({ region: 'ap-southeast-2' });
    const sportEvents = await new TennisliveClient().getSchedule()
    const fileList = await new S3ClientCustom().getFileList('tennis-match-schedule')

    var requestResult = 'error'

    console.log('>>>>total schedule number: ', sportEvents.length)
    console.log('>>>>checled number: ', fileList.length)

    if (sportEvents.length === fileList.length) {
      return 'finish'
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
          const input = {
            QueueUrl: queueUrl,
            MessageBody: JSON.stringify(sporte),
            DelaySeconds: 10,
          };
          const command = new SendMessageCommand(input);
          await client.send(command);
        })
      )


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
          var checkPlayerResult = await new PlayerAdapter().checkPlayerObject(
            sportEvent.player1, sportEvent.player2)

          await new S3ClientCustom()
            .putFile('tennis-match-schedule',
            sportEvent.id+'.json',
              JSON.stringify(checkPlayerResult))
        } catch(ex) {
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


    // const fileListIds = fileList.map(file => file.replace('.json', ''))
    // const sportEventIds = sportEvents.map(se => se.id)
    // const sportEventIdsNotCheckedYet = sportEventIds.filter(id => !fileListIds.includes(id))

    // // get first sportEvent that not checked
    // const sportEventsNeedCheck = sportEvents.filter(spe => sportEventIdsNotCheckedYet.includes(spe.id))

    // console.log('>>>>sportEventsNeedCheck>>>',sportEventsNeedCheck.length)

    // var result

    // if (sportEventsNeedCheck.length == 0) {
    //   const fileContent = []
    //   await Promise.all(
    //     fileList.map( async file => {
    //       const content = await new S3ClientCustom().getFile('tennis-match-schedule', file)
    //       fileContent.push(JSON.parse(content))
    //     })
    //   )

    //   const filtered = fileContent.filter(e => {
    //     const wlP1 = _.get(e, 'analysis.winLoseRanking.player1', 0)
    //     const wlP2 = _.get(e, 'analysis.winLoseRanking.player2', 0)

    //     return wlP1 !== wlP2
    //   })

    //   const sorted = filtered.sort((a,b) => {
    //     const gapA = _.get(a, 'analysis.gap', 0)
    //     const gapB = _.get(b, 'analysis.gap', 0)

    //     return gapB - gapA
    //   })

    //   return sorted
    // }
    // else {
    //   try {
    //     result = await new PlayerAdapter().checkPlayerObject(
    //       sportEventsNeedCheck[0].player1, sportEventsNeedCheck[0].player2)

    //     await new S3ClientCustom()
    //       .putFile('tennis-match-schedule',
    //         sportEventsNeedCheck[0].id+'.json',
    //         JSON.stringify(result))
    //   } catch(ex) {
    //     result = 'error'
    //     await new S3ClientCustom()
    //       .putFile('tennis-match-schedule',
    //         sportEventsNeedCheck[0].id+'.json',
    //         JSON.stringify('{}'))
    //   }
    // }

    // return result
  }
}