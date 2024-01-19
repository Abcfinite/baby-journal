import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DeleteCommand, GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config'

export const put = async (tableName: string) => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  const command = new PutCommand({
    TableName: tableName,
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

export const get = async (tableName: string,
    itemId: string,
    itemName: string) => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  const command = new GetCommand({
    TableName: tableName,
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

export const remove = async (tableName: string, itemId: string) => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  const command = new DeleteCommand({
    TableName: tableName,
    Key: {
      id: itemId,
    },
  });

  const response = await docClient.send(command);
  console.log(response);
  return response;
}