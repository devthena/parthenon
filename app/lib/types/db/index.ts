import { ObjectId } from "mongodb";

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
