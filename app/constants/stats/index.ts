import { GameCode } from '@/enums/games';
import { WordleObject } from '@/interfaces/games';
import { StatsInitObject } from '@/interfaces/statistics';

export const INITIAL_WORDLE: WordleObject = {
  currentStreak: 0,
  distribution: new Array(6).fill(0),
  maxStreak: 0,
  totalPlayed: 0,
  totalWon: 0,
};

export const INITIAL_STATS: StatsInitObject = {
  // @todo: add property once Blackjack is implemented
  // [GameCode.Blackjack]: INITIAL_BLACKJACK,
  [GameCode.Wordle]: INITIAL_WORDLE,
};
