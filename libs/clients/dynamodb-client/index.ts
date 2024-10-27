import { ScanCommandInput, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { put, remove, get, scan, count, deleteAndRecreateTable, query } from './src/items';

export const executeQuery = async (params?: ScanCommandInput) => query(params)

export const executeScan = async (params?: ScanCommandInput) => scan(params)

export const countTable = async () => count('Bets')

export const getItem = async (tableName: string,
  itemId: string,
  itemName: string) => get(tableName,
      itemId,
      itemName)

export const putItem = async (tableName: string,
  item: object,
  replaceWhenExist: boolean = false,
  ) => put(tableName,
  item,
  replaceWhenExist)

export const removeItem = (tableName: string,
  itemId: string) => remove(tableName,
  itemId)

export const truncateTable = async (tableName: string) =>
  await deleteAndRecreateTable(tableName)
