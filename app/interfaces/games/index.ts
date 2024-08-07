import { ObjectId } from 'mongodb';
import { GameCode } from '@/enums/games';

export * from './wordle';

export interface GameDocument {
  _id?: ObjectId;
  discord_id: string;
  key: string;
  code: GameCode;
  data: { [key: string]: string | string[] };
}

export type GameObject = {
  [GameCode.Wordle]?: string;
};

export interface GamePayload {
  key?: string;
  code: GameCode;
  data: { [key: string]: string };
}
