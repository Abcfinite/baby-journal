import S3ClientCustom from '@abcfinite/s3-client-custom'
export default class CacheService {
    getEventCache = async (): Promise<string> => {
        const dataFile = await new S3ClientCustom().getFile('betapi-cache', 'events.json') as any
        return dataFile
    }

    setEventCache = async (events: string) => {
        await new S3ClientCustom().putFile('betapi-cache', 'events.json', events) as any
    }

    setPlayerCache = async (playerId: string, events: string) => {
        await new S3ClientCustom().putFile('betapi-cache', `ended/players/${playerId}.json`, events) as any
    }
}