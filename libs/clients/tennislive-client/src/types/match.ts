import { Player } from './player';

export type Match = {
  date: string,
  player: Player,
  stage: string,
  result: 'win' | 'lost',
}