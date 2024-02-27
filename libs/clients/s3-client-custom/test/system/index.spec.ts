import S3ClientCustom from '../../index'

describe('getFiles', () => {
  describe('getFiles', () => {
    it('should return response', async () => {
      const result = await new S3ClientCustom().getFiles()

      // expect(result.pendingBetCounts).toBe(3)
      expect(result).not.toBeNull
    })
  })
})