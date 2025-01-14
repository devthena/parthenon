import { WordleKeyStatus, WordleStatus } from '@/enums/games';

export interface WordleGuess {
  word: string;
  result: Array<WordleKeyStatus>;
}

export type WordleGuessesObject = {
  [key: number]: string[];
};

export interface WordleState {
  answer: string;
  currentGuess: string;
  guesses: WordleGuess[];
  keyResults: { [letter: string]: WordleKeyStatus };
  reward: number | null;
  status: WordleStatus;
}

export interface WordleObject {
  currentStreak: number;
  distribution: number[];
  maxStreak: number;
  totalPlayed: number;
  totalWon: number;
}

export type WordleAction =
  | { type: 'play' }
  | { type: 'delete' }
  | { type: 'enter' }
  | { type: 'key'; letter: string }
  | { type: 'reset' }
  | { type: 'resume' };
