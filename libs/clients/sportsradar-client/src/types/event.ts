import { Player } from "./player";

export type Event = {
  name: String,
  date: String,
  competitionName: String,
  player1: Player,
  player2: Player,
}