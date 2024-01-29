import { put, remove, get, scan } from './src/items';

export const executeScan = async (params?: object) => scan(params)

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
