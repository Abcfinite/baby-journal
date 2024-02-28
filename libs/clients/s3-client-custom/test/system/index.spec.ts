import S3ClientCustom from '../../index'

describe('S3ClientCustom', () => {
  describe('getFileList', () => {
    it('should return response', async () => {
      const result = await new S3ClientCustom().getFileList('tennis-match-data')

      expect(result).not.toBeNull
    })
  })

  describe('getFile', () => {
    it('should return response', async () => {
      const result = await new S3ClientCustom().getFile('tennis-match-data', '1.json')

      expect(result).not.toBeNull
    })
  })
})