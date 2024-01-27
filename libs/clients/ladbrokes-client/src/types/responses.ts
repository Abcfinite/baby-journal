export type PendingBets = {
  pendingBetCounts: number
}

export type Event = {
  id: string,
  player1: string,
  player2: string,
  player1Odd: number,
  player2Odd: number,
  tournament: string,
}

export type Bet = {
  id: string
  event: Event | null
}
