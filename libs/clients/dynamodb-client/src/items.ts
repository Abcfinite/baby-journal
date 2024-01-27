import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DeleteCommand, GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { getItem } from '../index';

export const put = async (tableName: string,
  item: object,
  replaceWhenExist: boolean = false) => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client)

  if (!replaceWhenExist) {
    const getResult = await get(tableName, item['Id'])
    if (getResult.Item) {
      return
    }
  }

  const command = new PutCommand({
    TableName: tableName,
    Item: item
  })

  const response = await docClient.send(command)

  return response;
}

export const get = async (tableName: string,
    itemId: string,
    itemName: string | null = null) => {
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);

  const Key = { Id: itemId }
  if (itemName) {
    Key['Category'] = itemName
  }

  const command = new GetCommand({
    TableName: tableName,
    Key,
  });

  const response = await docClient.send(command);

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