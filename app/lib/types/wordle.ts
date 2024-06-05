import { WordleStatus } from '../enums/wordle';

export type AnswerGridProps = {
  colors: GuessesObject;
  guesses: GuessesObject;
  status: WordleStatus;
  turn: number;
};

export type ColorObject = {
  [key: string]: string;
};

export type GuessesObject = {
  [key: number]: string[];
};

export type KeyboardProps = {
  colors: ColorObject;
  keys: string[][];
  onKeyUp: Function;
};

export type KeyTileProps = {
  id: string;
};

export type NoticeProps = {
  word: string;
  status: WordleStatus;
};
