import { GameCode } from '@/enums/games';
import { BlackjackObject, WordleObject } from '@/interfaces/games';
import { StatsInitObject } from '@/interfaces/statistics';

export const INITIAL_BLACKJACK: BlackjackObject = {
  totalBlackjack: 0,
  totalPlayed: 0,
  totalWon: 0,
};

export const INITIAL_WORDLE: WordleObject = {
  currentStreak: 0,
  distribution: new Array(6).fill(0),
  maxStreak: 0,
  totalPlayed: 0,
  totalWon: 0,
};

export const INITIAL_STATS: StatsInitObject = {
  [GameCode.Blackjack]: INITIAL_BLACKJACK,
  [GameCode.Wordle]: INITIAL_WORDLE,
};
