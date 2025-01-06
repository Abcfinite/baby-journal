import BetapiClient from '@abcfinite/betapi-client'
import { Handler } from 'aws-lambda';

export const getPlayer: Handler = async (event: any) => {
  const { player1Id, player2Id } = event.queryStringParameters

  const player1Matches = await new BetapiClient().getPlayerEndedMatches(player1Id, '92')
  const player2Matches = await new BetapiClient().getPlayerEndedMatches(player2Id, '92')

  const responseText = `player 1 matches: ${player1Matches.length}, player 2 matches: ${player2Matches.length}`

  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: responseText,
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

