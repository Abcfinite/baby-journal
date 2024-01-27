import { put, remove, get } from './src/items';

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
