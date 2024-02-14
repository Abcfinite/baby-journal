import { Player } from "./player";

export type SportEvent = {
  id: String,
  date: String,
  competitionName: String,
  player1: Player,
  player2: Player,
}