import { ModalContent } from '@/enums/wordle';
import { KeyStatus, WordleStatus } from '@/enums/wordle';

export interface WordleGuess {
  word: string;
  result: Array<KeyStatus>;
}

export type WordleGuessesObject = {
  [key: number]: string[];
};

export interface WordleState {
  answer: string;
  currentGuess: string;
  guesses: WordleGuess[];
  keyResults: { [letter: string]: KeyStatus };
  modalContent: ModalContent;
  modalDisplay: boolean;
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
