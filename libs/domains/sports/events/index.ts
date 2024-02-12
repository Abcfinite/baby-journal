import BetAdapter from '@abcfinite/bet-adapter'

import { Handler } from 'aws-lambda';

export const logEvents: Handler = async (event: any) => {
  await new BetAdapter().logEvents()

  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'new events stored successfully in dynamodb',
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

export const summary: Handler = async (event: any) => {
  const { sport } = event.queryStringParameters
  const result = await new BetAdapter().getSummary(sport)
  result['count'] = await new BetAdapter().betTableTotalNumber()

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

