import { ObjectId } from 'mongodb';
import { GameCode } from '@/enums/games';

import { WordleObject } from './wordle';

export interface DataObject {
  activities: ActivityStateObject | null;
  user: UserStateObject | null;
}

export interface StarObject {
  stars: number;
  last_given: string | null;
  total_given: number;
}

export interface ActivityObject {
  _id: ObjectId;
  discord_id: string;
  str: StarObject;
}

export interface ActivityStateObject {
  stars: number;
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
  key?: string;
  data: StatsStateObject;
}

export interface UserObject {
  _id: ObjectId;
  user_id: string;
  discord_id: string | null;
  discord_username: string | null;
  discord_name: string | null;
  twitch_id: string | null;
  twitch_username: string | null;
  cash: number;
}

export interface UserStateObject {
  cash: number;
  discord_name: string;
  discord_username: string;
  twitch_username: string;
  code?: string;
}
