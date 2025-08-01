import {
  LeanUserDocument,
  UserAuthMethod,
  UserObject,
} from '@/interfaces/user';

import { UserModel } from '@/models/user';

/**
 * stripId
 * @returns A version of the document without the _id
 */
const stripId = (doc: LeanUserDocument | null) =>
  doc ? (({ _id, ...rest }) => rest)(doc) : null;

/**
 * attemptUserMerge
 * @returns The updated User object containing both Discord and Twitch data or NULL
 */
export const attemptUserMerge = async (payload: {
  discord_id: string;
  twitch_id: string;
}): Promise<UserObject | null> => {
  const { discord_id, twitch_id } = payload;

  const discordDoc = await UserModel.findOne({
    discord_id,
  }).lean<LeanUserDocument>();

  const discordData = stripId(discordDoc);

  if (discordData && discordData.twitch_id) return discordData;

  const twitchDoc = await UserModel.findOne({
    twitch_id,
  }).lean<LeanUserDocument>();

  const twitchData = stripId(twitchDoc);

  if (discordData && twitchData) {
    const updatedUser: UserObject = {
      ...discordData,
      twitch_id,
      twitch_username: twitchData.twitch_username,
      cash: discordData.cash + twitchData.cash,
    };

    await Promise.all([
      UserModel.findOneAndUpdate({ discord_id }, updatedUser),
      UserModel.findOneAndDelete({ twitch_id }),
    ]);

    return updatedUser;
  }

  return discordData ?? twitchData ?? null;
};

/**
 * getUser
 * This fetches a User document by Discord or Twitch ID
 * @returns The User document or NULL
 */
export const getUser = async (
  id: string,
  method: UserAuthMethod
): Promise<UserObject | null> => {
  const user = await UserModel.findOne({
    [`${method}_id`]: id,
  }).lean<LeanUserDocument>();

  if (!user) return null;

  const { _id, ...rest } = user as LeanUserDocument;
  return rest;
};
