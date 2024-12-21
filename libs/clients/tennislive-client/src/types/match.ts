import { Player } from './player'

export interface Match {
  date: string,
  player: Player,
  stage: string,
  score: string,
  tournament: string,
  result: 'win' | 'lost',
}