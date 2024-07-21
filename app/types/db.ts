import { ObjectId } from 'mongodb';

import { GameCode } from '@/enums/games';

import { WordleObject } from './wordle';

export interface StarObject {
  stars: number;
  last_given: string | null;
  total_given: number;
}

export interface StatsObject {
  _id?: ObjectId;
  discord_id: string;
  [GameCode.Wordle]: WordleObject;
}

export type StatsStateObject = {
  [GameCode.Wordle]?: WordleObject;
};

export interface StatsStatePayload {
  code: GameCode;
  data: StatsStateObject;
}
