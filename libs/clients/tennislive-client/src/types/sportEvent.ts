import { Player } from "./player";

export type SportEvent = {
  id: string,
  date: string,
  url: string,
  competitionName: string,
  player1: Player,
  player2: Player,
}