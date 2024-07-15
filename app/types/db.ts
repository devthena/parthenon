import { ObjectId } from 'mongodb';
import { WordleObject } from './wordle';
import { BlackjackObject } from './blackjack';

export type GameObject = BlackjackObject | WordleObject;

export interface DataObject {
  activities: ActivityStateObject | null;
  stats: StatsObject | null;
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
  blk?: BlackjackObject;
  wdl?: WordleObject;
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
