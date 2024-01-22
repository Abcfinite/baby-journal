import HttpApiClient from '../../index'

describe('HttpService', () => {
  describe('get', () => {
    it('should return response', async () => {

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': process.env.LADBROKES_BEARER_TOKEN
      }
      const httpApiClient = new HttpApiClient()
      const result = await httpApiClient.get(
        'https://api.ladbrokes.com.au',
        '/v2/client/PendingBetCount',
        headers,
      )

      expect(result.status).toEqual(200)
      expect(result.value).not.toBeNull
    })
  })
})