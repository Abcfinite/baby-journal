import PlayerAdapter from '@abcfinite/player-adapter'
import ScheduleAdapter from '@abcfinite/schedule-adapter'
import { Handler } from 'aws-lambda';

export const checkPlayer: Handler = async (event: any) => {
  const { player1, player2, player1Odd, player2Odd } = event.queryStringParameters
  var response

  if (player1 === null || player1 === '' ||
    player2 === null || player2 === '' ||
    player1Odd === null || player1Odd === '' ||
    player2Odd === null || player2Odd === '') {
    response = {
      statusCode: 400,
      body: 'missing parameters'
    }
  } else {
    var result

    try {
      result = await new PlayerAdapter().checkPlayer(
        player1, player2,
        parseFloat(player1Odd), parseFloat(player2Odd))

      response = {
        statusCode: 200,
        body: JSON.stringify(result,
          null,
          2
        ),
      }
    } catch {
      response = {
        statusCode: 400,
        body: 'one of player not found',
      }
    }
  }

  return new Promise((resolve) => {
    resolve(response)
  })
}


export const getSchedule: Handler = async (event: any) => {
  var result = await new ScheduleAdapter().getSchedule()

  var response = {
    statusCode: 200,
    body: JSON.stringify(result,
      null,
      2
    ),
  }

  return new Promise((resolve) => {
    resolve(response)
  })
}

