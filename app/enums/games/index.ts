export * from './blackjack';
export * from './wordle';

export enum GameCode {
  Blackjack = 'blk',
  Wordle = 'wdl',
}

export enum GamePage {
  Overview,
  Playing,
}

export enum GameRequestType {
  Create = 'create',
  Update = 'update',
}
