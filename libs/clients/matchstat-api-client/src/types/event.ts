import { Player } from "./player"

export type Event = {
    id: string,
    date: string,
    roundId: string,
    tournamentId: string,
    player1: Player,
    player2: Player
  }