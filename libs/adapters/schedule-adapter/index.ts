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
import { toCsv } from "./src/utils/builder"

export default class ScheduleAdapter {
  async getSchedule() {
    var requestResult = 'error'
    const resultFile = await new S3ClientCustom().getFile('tennis-match-schedule', 'result.json')

    if (resultFile !== undefined) {
      return toCsv(resultFile)
    }

    const queueUrl = 'https://sqs.ap-southeast-2.amazonaws.com/146261234111/tennis-match-schedule-queue'
    const client = new SQSClient({ region: 'ap-southeast-2' });
    const sportEvents = await new TennisliveClient().getSchedule()
    const fileList = await new S3ClientCustom().getFileList('tennis-match-schedule')
    const fileContent = []

    console.log('>>>>total schedule number: ', sportEvents.length)
    console.log('>>>>checked number: ', fileList.length)

    if (sportEvents.length - 5 < fileList.length) {
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

      /// sort by ranking diff
      // const sorted = fileContent.sort((a,b) => {
      //   const rankingA = _.get(a, 'analysis.highLowRanking.rankingDiff', 0)
      //   const rankingB = _.get(b, 'analysis.highLowRanking.rankingDiff', 0)

      //   return rankingB - rankingA
      // })

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