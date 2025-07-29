import {
  LeanUserDocument,
  UserAuthMethod,
  UserObject,
} from '@/interfaces/user';
import { UserModel } from '@/models/user';

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

  if (!user) null;

  const { _id, ...rest } = user as LeanUserDocument;
  return rest;
};
