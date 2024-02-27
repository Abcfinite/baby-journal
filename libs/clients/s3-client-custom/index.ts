import { ListObjectsV2Command, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
export default class S3ClientCustom {

  constructor() {}

  async getFiles() {
    const client = new S3Client({});

    const command = new ListObjectsV2Command({
      Bucket: "tennis-match-data",
      // The default and maximum number of keys returned is 1000. This limits it to
      // one for demonstration purposes.
      MaxKeys: 1,
    });

    try {
      let isTruncated = true;

      console.log("Your bucket contains the following objects:\n");
      let contents = "";

      while (isTruncated) {
        const { Contents, IsTruncated, NextContinuationToken } =
          await client.send(command);
        const contentsList = Contents.map((c) => ` • ${c.Key}`).join("\n");
        contents += contentsList + "\n";
        isTruncated = IsTruncated;
        command.input.ContinuationToken = NextContinuationToken;
      }
      console.log(contents);
    } catch (err) {
      console.error(err);
    }
  }
}