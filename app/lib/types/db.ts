import { ObjectId } from 'mongodb';
import { GameCode } from '../enums/games';
import { WordleObject } from './wordle';

export interface StatsObject {
  _id?: ObjectId;
  discord_id: string;
  code: GameCode;
  data: WordleObject;
}

export interface UserObject {
  _id?: ObjectId;
  user_id: string;
  discord_id: string | null;
  discord_username: string | null;
  discord_name: string | null;
  twitch_id: string | null;
  twitch_username: string | null;
  cash: number;
  gamble_wins?: number;
  gamble_losses?: number;
  times_given?: number;
}
