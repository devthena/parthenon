import { ObjectId } from 'mongodb';

import { GameCode } from '@/enums/games';
import { BlackjackObject, WordleObject } from './games';

export interface StatsDocument {
  _id: ObjectId;
  discord_id: string;
  [GameCode.Blackjack]?: BlackjackObject;
  [GameCode.Wordle]?: WordleObject;
}

export interface StatsObject {
  [GameCode.Blackjack]?: BlackjackObject;
  [GameCode.Wordle]?: WordleObject;
}

export interface StatsInitObject {
  [GameCode.Blackjack]: BlackjackObject;
  [GameCode.Wordle]: WordleObject;
}
