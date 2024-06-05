import { ObjectId } from 'mongodb';
import { LoginMethod } from '../enums/auth';
import { RequestType } from '../enums/db';

export type StatsObject = {
  _id: ObjectId;
  discord_id?: string;
  twitch_id?: string;
  wordle: StatsWordleObject;
};

export type StatsReadPayload = {
  id: string;
  method: LoginMethod;
};

export type StatsRequest = {
  type: RequestType;
  payload: StatsReadPayload | StatsUpdatePayload;
};

export type StatsUpdatePayload = {
  discord_id?: string;
  twitch_id?: string;
  wordle: StatsWordleObject;
};

export type StatsWordleObject = {
  currentStreak: number;
  distribution: number[];
  maxStreak: number;
  totalPlayed: number;
  totalWon: number;
};

export type StatsWordleProps = {
  data: StatsWordleObject;
};

export type UserObject = {
  _id: ObjectId;
  user_id: string;
  discord_id: string;
  discord_username: string;
  twitch_id: string;
  twitch_username: string;
  accounts_linked: boolean;
  cash: number;
  bank: number;
  stars: number;
  power_ups: string[];
};
