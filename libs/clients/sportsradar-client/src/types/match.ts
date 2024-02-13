import { Player } from './player';

export type Match = {
  player: Player,
  result: 'won' | 'lost',
}