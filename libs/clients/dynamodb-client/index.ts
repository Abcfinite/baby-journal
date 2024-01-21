import { put, remove, get } from './src/items';

// get('weight','522d0926-5476-403b-adf4-96b3e9d18c3c', 'Timmy')
// put();
// remove("782b42a0-c684-4876-bbcd-2823036f3b3f");

export const getItem = async (tableName: string,
    itemId: string,
    itemName: string) => get(tableName,
        itemId,
        itemName)