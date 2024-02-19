import { Match } from "./match";

export type Player = {
  id: string,
  name: string,
  country: string,
  dob: string,
  currentRanking: Number,
  highestRanking: Number,
  total: Number,
  won: Number,
  previousMatches: Array<Match>
}