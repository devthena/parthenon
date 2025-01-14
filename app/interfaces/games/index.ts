import { ObjectId } from 'mongodb';
import { GameCode, GameRequestType } from '@/enums/games';

export * from './blackjack';
export * from './cards';
export * from './wordle';

export interface GameDocument {
  _id?: ObjectId;
  discord_id: string;
  key: string;
  code: GameCode;
  data: { [key: string]: string | string[] };
}

export type GameObject = {
  [GameCode.Blackjack]?: string;
  [GameCode.Wordle]?: string;
};

export interface GamePayload {
  key?: string;
  code: GameCode;
  type: GameRequestType;
  data: { [key: string]: string };
}
