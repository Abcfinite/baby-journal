import { Match } from "./match";

export type Player = {
  name: String,
  age: String,
  currentRanking: Number,
  highestRanking: Number,
  total: Number,
  won: Number,
  previousMatches: Array<Match>
}