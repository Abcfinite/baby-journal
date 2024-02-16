import { Match } from "./match";

export type Player = {
  id: string,
  name: string,
  age: string,
  currentRanking: Number,
  highestRanking: Number,
  total: Number,
  won: Number,
  previousMatches: Array<Match>
}