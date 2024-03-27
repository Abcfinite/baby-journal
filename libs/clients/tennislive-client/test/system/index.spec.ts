import TennisliveClient from '../../index'

describe('TennisliveClient', () => {
  describe('getPlayer', () => {
    it('should return response', async () => {
      const result = await new TennisliveClient().getPlayer('moez echargui')

      expect(result).not.toBeNull
    })
  })

  describe('getSchedule', () => {
    it('should return response', async () => {
      const result = await new TennisliveClient().getSchedule()

      expect(result).not.toBeNull
    })
  })
})