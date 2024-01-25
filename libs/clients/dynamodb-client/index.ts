import { put, remove, get } from './src/items';

export const getItem = async (tableName: string,
  itemId: string,
  itemName: string) => get(tableName,
      itemId,
      itemName)

export const putItem = async (tableName: string,
  item: object) => put(tableName,
  item)

export const removeItem = (tableName: string,
  itemId: string) => remove(tableName,
  itemId)
