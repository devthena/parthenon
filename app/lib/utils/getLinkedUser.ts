import type { ExternalAccountResource } from '@clerk/types';
import { UserObject } from '@/interfaces/user';
import { API_URLS } from '@/constants/api';

export const getLinkedUser = async (
  accounts: ExternalAccountResource[],
  fetchGet: <T>(url: string) => Promise<T | null>,
  fetchPost: <T>(url: string, payload: Partial<T>) => Promise<T | null>
): Promise<UserObject | null> => {
  let data = null;

  if (accounts.length < 2) {
    const userAccount = accounts[0];

    const url = `${API_URLS.USERS}/${userAccount.providerUserId}?method=${userAccount.provider}`;
    data = await fetchGet<UserObject>(url);
  } else {
    const discordInfo = accounts.find(
      account => account.provider === 'discord'
    );
    const twitchInfo = accounts.find(account => account.provider === 'twitch');

    data = await fetchPost<UserObject>(API_URLS.USERS, {
      discord_id: discordInfo!.providerUserId,
      twitch_id: twitchInfo!.providerUserId,
    });
  }

  return data;
};
