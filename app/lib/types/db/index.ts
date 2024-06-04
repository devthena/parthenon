import { ObjectId } from 'mongodb';

export type StatsObject = {
  _id: ObjectId;
  discord_id: string | null;
  twitch_id: string | null;
  wordle: StatsWordleObject;
};

export type StatsWordleObject = {
  currentStreak: number;
  distribution: number[];
  maxStreak: number;
  totalPlayed: number;
  totalWon: number;
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
