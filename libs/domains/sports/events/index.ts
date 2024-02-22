import PlayerAdapter from '@abcfinite/player-adapter'

import { Handler } from 'aws-lambda';

export const checkPlayer: Handler = async (event: any) => {
  const { player1, player2 } = event.queryStringParameters

  console.log('>>>player1 : ', player1)
  console.log('>>>player2 : ', player2)

  const result = await new PlayerAdapter().checkPlayer(player1, player2)

  const response = {
    statusCode: 200,
    body: JSON.stringify(result,
      null,
      2
    ),
  };

  return new Promise((resolve) => {
    resolve(response)
  })
}

