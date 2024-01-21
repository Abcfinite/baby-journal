import HttpApiClient from '../../index'

describe('HttpService', () => {
  describe('get', () => {
    it('should return response', async () => {
      const httpApiClient = new HttpApiClient()
      const result = httpApiClient.get(
        'https://www.google.com/'
      )

      console.debug('>>>>>>>>')
      console.debug(result)

    })
  })
})