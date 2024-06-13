import { ObjectId } from 'mongodb';

export type FetchParams = {
  params: {
    id: string;
  };
};

export type StatsObject = {
  _id?: ObjectId;
  user_id: string;
  wordle: WordleObject;
};

export type UserObject = {
  _id: ObjectId;
  user_id: string;
  discord_id: string | null;
  discord_username: string | null;
  discord_name: string | null;
  twitch_id: string | null;
  twitch_username: string | null;
  cash: number;
  bank: number;
  stars: number;
};

export type WordleObject = {
  currentStreak: number;
  distribution: number[];
  maxStreak: number;
  totalPlayed: number;
  totalWon: number;
};
