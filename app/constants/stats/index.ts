import { BlackjackObject } from '@/types/blackjack';
import { StatsObject } from '@/types/db';
import { WordleObject } from '@/types/wordle';

export const INITIAL_BLACKJACK: BlackjackObject = {
  totalBlackjack: 0,
  totalPlayed: 0,
  totalPush: 0,
  totalWon: 0,
};

export const INITIAL_WORDLE: WordleObject = {
  currentStreak: 0,
  distribution: new Array(6).fill(0),
  maxStreak: 0,
  totalPlayed: 0,
  totalWon: 0,
};

export const INITIAL_STATS: StatsObject = {
  discord_id: '',
  // @todo: Add blk property once Blackjack is implemented
  // blk: INITIAL_BLACKJACK,
  wdl: INITIAL_WORDLE,
};
