// import BetAdapter from "../../../adapters/bet-adapter"

import { Handler } from 'aws-lambda';

export const logBets: Handler = async (event: any) => {
  // await new BetAdapter().logBets()

  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'your pending bets stored successfully in dynamodb',
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
