import BetapiClient from '@abcfinite/betapi-client'
import { Handler } from 'aws-lambda';

export const getPlayer: Handler = async (event: any) => {
  await new BetapiClient().getPlayerEndedMatches('162276')

  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'player data',
        input: event,
      },
      null,
      2
    ),
  };

  return new Promise((resolve) => {
    resolve(response)
  })
}

