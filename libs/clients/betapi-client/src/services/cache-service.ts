import S3ClientCustom from '@abcfinite/s3-client-custom'
export default class CacheService {

    constructor() {}

    getEventCache = async (): Promise<string> => {
        const dataFile = await new S3ClientCustom().getFile('betapi-cache', 'events.json') as any
        return dataFile
    }

    setEventCache = async (events: string) => {
        await new S3ClientCustom().putFile('betapi-cache', 'events.json', events) as any
    }
}