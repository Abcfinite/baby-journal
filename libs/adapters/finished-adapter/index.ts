import _ from "lodash"
import { putItem } from '@abcfinite/dynamodb-client'
import S3ClientCustom from '@abcfinite/s3-client-custom'
import TennisliveClient from '@abcfinite/tennislive-client'
import { Player } from '../../clients/tennislive-client/src/types/player'
import { SportEvent } from "@abcfinite/tennislive-client/src/types/sportEvent"
import PlayerAdapter from '@abcfinite/player-adapter'
import { getFinished } from '../../domains/sports/events/index';
import { SQSClient, SendMessageCommand,
  ReceiveMessageCommand, GetQueueAttributesCommand,
  DeleteMessageCommand } from "@aws-sdk/client-sqs";

export default class ScheduleAdapter {
  async getFinished() {
    const sportEvents = await new TennisliveClient().getFinished()
    return sportEvents
  }
}