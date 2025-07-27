import { UserAuthMethod, UserDocument } from '@/interfaces/user';
import { UserModel } from '@/models/user';

/**
 * getUser
 * This fetches a User document by Discord or Twitch ID
 * @returns The User document or NULL
 */
export const getUser = async (
  id: string,
  method: UserAuthMethod
): Promise<UserDocument | null> => {
  return await UserModel.findOne({ [`${method}_id`]: id });
};
