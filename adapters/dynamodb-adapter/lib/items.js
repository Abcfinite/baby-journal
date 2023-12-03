import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

export const put = async() => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  const command = new PutCommand({
    TableName: "weight",
    Item: {
      id :  uuidv4(),
      name: "Timmy",
      weight: 1.8,
    },
  });

  const response = await docClient.send(command);
  console.log(response);
  return response;
}
