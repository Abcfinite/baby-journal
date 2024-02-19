import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, DeleteCommand, GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

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

//todo: might want to remove this
export const count = async (tableName: string) => {
  const client = new DynamoDBClient({});

  const command = new ScanCommand({
    TableName: tableName,
    Select: 'COUNT'
  })

  const response = await client.send(command);

  return response;
}

export const scan = async (params: object) => {
  const client = new DynamoDBClient({});

  const command = new ScanCommand({
    FilterExpression: "Category = :cat",
    ExpressionAttributeValues: {
      ":cat": { S: params['sport'] },
    },
    ProjectionExpression: `Id, Category, EventId,
        H2hDraw, H2hPlayer1Win, H2hPlayer2Win, OddCorrect,
        Player1, Player1Odd, Player2, Player2Odd, RatingPlayer1End,
        RatingPlayer1Start, RatingPlayer2End, RatingPlayer2Start,
        Tournament, PlayDateTime`,
      TableName: "Bets",
    })

  const response = await client.send(command);

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