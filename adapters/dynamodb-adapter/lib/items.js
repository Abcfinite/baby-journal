import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DeleteCommand, GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config'

export const put = async () => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  const command = new PutCommand({
    TableName: process.env.TABLE_NAME,
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

export const get = async (itemId, itemName) => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  const command = new GetCommand({
    TableName: process.env.TABLE_NAME,
    Key: {
      id : itemId,
      name: itemName
    },
  });

  const response = await docClient.send(command);
  console.log(response);
  return response;
}

export const update = async () => {

}

export const remove = async (itemId) => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  const command = new DeleteCommand({
    TableName: process.env.TABLE_NAME,
    Key: {
      id: itemId,
    },
  });

  const response = await docClient.send(command);
  console.log(response);
  return response;
}