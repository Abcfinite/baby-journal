import { HttpResponse } from "@abcfinite/http-api-client/src/types/http-response";
import EventParser from "./event-parser";

export default class EventsParser {
    constructor() {}

    parse = (results : Array<HttpResponse>) => {
        results.map(r => {
            const event = new EventParser().parse(r)
        })
    }
}