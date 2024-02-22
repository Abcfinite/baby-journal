import { Match } from "./match"

export type Player = {
  id: string,
  name: string,
  country: string,
  dob: string,
  currentRanking: number,
  highestRanking: number,
  matchesTotal: number,
  matchesWon: number,
  url: string | null,
  previousMatches: HTMLElement | null
  parsedPreviousMatches: Array<Match> | null
}