import { EventDetail } from "./eventDetail";

export type Bet = {
  Id: string,
  EventId: string,
} & EventDetail
