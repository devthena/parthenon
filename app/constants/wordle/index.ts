import { WordleStatus } from '@/enums/games';
import { WordleState } from '@/interfaces/games';

export * from './answer-list';
export * from './key-list';
export * from './word-list';

export const INITIAL_STATE_WDL: WordleState = {
  answer: '',
  currentGuess: '',
  guesses: [],
  keyResults: {},
  reward: null,
  status: WordleStatus.Standby,
};

export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;

export const WORDLE_REWARDS = [10000, 1000, 500, 250, 100, 50];
