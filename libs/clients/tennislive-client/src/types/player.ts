import { Match } from "./match"

export type Player = {
  id: string,
  name: string,
  country: string,
  dob: string,
  currentRanking: Number,
  highestRanking: Number,
  matchesTotal: Number,
  matchesWon: Number,
  url: string | null,
  previousMatches: HTMLElement | null
  parsedPreviousMatches: Array<Match> | null
}