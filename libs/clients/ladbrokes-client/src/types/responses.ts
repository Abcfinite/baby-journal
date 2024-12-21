export interface PendingBets {
  pendingBetCounts: number
}

export interface Event {
  id: string,
  player1: string,
  player2: string,
  player1Odd: number,
  player2Odd: number,
  tournament: string,
  category: string
  advertisedStart: Date
}

export interface Bet {
  id: string
  event: Event | null
}
