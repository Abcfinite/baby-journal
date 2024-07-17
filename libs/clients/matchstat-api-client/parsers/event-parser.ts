import { HttpResponse } from "@abcfinite/http-api-client/src/types/http-response";

export default class EventParser {
    constructor() {}

    parse = (result: HttpResponse) => {
        result.value['data'].map(e => {
            console.log(e)
        })
    }
}