import { KeyStatus, ModalContent, WordleStatus } from '../enums/wordle';

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
  keyResults: { [letter: string]: KeyStatus };
  modalContent: ModalContent;
  modalDisplay: boolean;
  reward: number | null;
  status: WordleStatus;
}
