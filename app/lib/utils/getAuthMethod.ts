export const getAuthMethod = (provider: string) => {
  return provider.replace('oauth_', '');
};
