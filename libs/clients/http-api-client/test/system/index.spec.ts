import HttpApiClient from '../../index'

describe('HttpService', () => {
  describe('get', () => {
    it('should return response', async () => {

      console.debug('>>>>>LADBROKES')
      console.debug(process.env.LADBROKES_BEARER_TOKEN)

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': process.env.LADBROKES_BEARER_TOKEN
      }
      const httpApiClient = new HttpApiClient()
      const result = httpApiClient.get(
        'https://api.ladbrokes.com.au',
        'v2/client/PendingBetCount',
        headers,
      )

      // console.debug('>>>>>>>>')
      // console.debug(result)

    })
  })
})