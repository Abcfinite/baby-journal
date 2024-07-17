import { HttpResponse } from "@abcfinite/http-api-client/src/types/http-response";
import { Event } from '../types/event'
import { Player } from '../types/player';

export default class EventParser {
    constructor() {}

    parse = (result: HttpResponse) => {
        return result.value['data'].map(e => {
            const p1 = {
                id: e['player1']['id'],
                name: e['player1']['name'],
                countryAcr: e['player1']['countryAcr'],
            }

            const p2 = {
                id: e['player2']['id'],
                name: e['player2']['name'],
                countryAcr: e['player2']['countryAcr'],
            }

            return {
                id: e['id'],
                date: e['date'],
                roundId: e['roundId'],
                tournamentId: e['tournamentId'],
                player1: p1,
                player2: p2
            }
        })
    }
}