import { Player } from './player';

export type Match = {
  player: Player,
  result: 'win' | 'lost',
}