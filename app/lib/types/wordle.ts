import { KeyStatus, WordleStatus } from '../enums/wordle';

export interface Guess {
  word: string;
  result: Array<KeyStatus>;
}

export type GuessesObject = {
  [key: number]: string[];
};

export interface WordleObject {
  currentStreak: number;
  distribution: number[];
  maxStreak: number;
  totalPlayed: number;
  totalWon: number;
}

export interface WordleState {
  answer: string;
  currentGuess: string;
  guesses: Guess[];
  status: WordleStatus;
  keyResults: { [letter: string]: KeyStatus };
}
