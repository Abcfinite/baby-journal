import { Player } from './player';

export type Match = {
  date: string,
  player: Player,
  result: 'win' | 'lost',
}