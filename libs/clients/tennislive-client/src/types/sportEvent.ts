import { Player } from "./player";

export type SportEvent = {
  id: string,
  date: string,
  time: string,
  stage: string,
  url: string,
  competitionName: string,
  player1: Player,
  player2: Player,
}

export const playerNamesToSportEvent = (player1Id: string, player1Name: string, player2Id: string, player2Name: string): SportEvent => {
  return {
    id: '',
    date: '',
    time: '',
    stage: '',
    url: '',
    competitionName: '',
    player1: {
      id: player1Id,
      name: player1Name,
      country: '',
      dob: '',
      currentRanking: 0,
      highestRanking: 0,
      matchesTotal: 0,
      matchesWon: 0,
      url: null,
      type: '',
      previousMatches: null,
      parsedPreviousMatches: null
    },
    player2: {
      id: player2Id,
      name: player2Name,
      country: '',
      dob: '',
      currentRanking: 0,
      highestRanking: 0,
      matchesTotal: 0,
      matchesWon: 0,
      url: null,
      type: '',
      previousMatches: null,
      parsedPreviousMatches: null
    }
  }
}