import { ObjectId } from 'mongodb';

import { GameCode } from '@/enums/games';
import { WordleObject } from './games';

export interface StatsDocument {
  _id: ObjectId;
  discord_id: string;
  [GameCode.Wordle]?: WordleObject;
}

export interface StatsObject {
  [GameCode.Wordle]?: WordleObject;
}

export interface StatsInitObject {
  [GameCode.Wordle]: WordleObject;
}
