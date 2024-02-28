import { ListObjectsV2Command, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
export default class S3ClientCustom {

  constructor() {}

  async getFileList(bucketName: string) : Promise<string[]>{
    const client = new S3Client({});

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      // The default and maximum number of keys returned is 1000. This limits it to
      // one for demonstration purposes.
      MaxKeys: 1,
    });

    try {
      let isTruncated = true;
      const fileList = []

      while (isTruncated) {
        const { Contents, IsTruncated, NextContinuationToken } = await client.send(command);
        Contents.map((c) => fileList.push(c.Key));
        isTruncated = IsTruncated;
        command.input.ContinuationToken = NextContinuationToken;
      }

      return fileList
    } catch (err) {
      console.error(err);
    }
  }

  async getFile(bucketName: string, fileName: string) : Promise<string> {
    const client = new S3Client({});
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    try {
      const response = await client.send(command);
      // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
      const str = await response.Body.transformToString();

      return str
    } catch (err) {
      console.error(err);
    }
  }
}