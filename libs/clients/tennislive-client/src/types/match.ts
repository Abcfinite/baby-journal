import { Player } from './player';

export type Match = {
  date: string,
  player: Player,
  stage: string,
  score: string,
  tournament: string,
  result: 'win' | 'lost',
}