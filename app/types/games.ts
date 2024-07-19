import { ObjectId } from 'mongodb';
import { GameCode } from '@/enums/games';

export interface GameObject {
  _id?: ObjectId;
  discord_id: string;
  key: string;
  code: GameCode;
  data: { [key: string]: string | string[] };
}

export type GameStateObject = {
  [GameCode.Wordle]?: string;
};

export interface GamePayload {
  code: GameCode;
  key?: string;
  data: { [key: string]: string };
}
