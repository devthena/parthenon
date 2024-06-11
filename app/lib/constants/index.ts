export const CommandsDiscord = [
  {
    name: '/8ball',
    sub: '<value>',
    description: 'Play a game of Magic 8-Ball',
    note: 'Accepted Value: <question>',
  },
  {
    name: '/coinflip',
    description: 'Flip a coin!',
  },
  {
    name: '/gamble',
    sub: '<value>',
    description: 'Play your points for a chance to double it',
    note: 'Accepted Values: <positive integer> | half | all',
  },
  {
    name: '/give',
    sub: '<@member> <value>',
    description: 'Give your points to another user',
    note: 'Accepted Value: <positive integer>',
  },
  {
    name: '/points',
    description: 'View your current balance',
  },
  {
    name: '/star',
    sub: '<@member>',
    description: 'Give a star to a user as a form of endorsement',
  },
];

export const CommandsTwitch = [
  {
    name: '!gamble',
    sub: '<value>',
    description: 'Play your points for a chance to double it',
    note: 'Accepted Values: <positive integer> | half | all',
  },
  {
    name: '!points',
    description: 'View your current balance',
  },
];

export const NavPaths = [
  {
    label: 'Home',
    value: '/',
    protected: false,
  },
  // {
  //   label: 'Games',
  //   value: '/games',
  //   protected: true,
  // },
  {
    label: 'Commands',
    value: '/commands',
    protected: false,
  },
  {
    label: 'FAQ',
    value: '/faq',
    protected: false,
  },
];

export const SocialUrls = {
  Github: 'https://github.com/devthena',
  Instagram: 'https://instagram.com/theathenaus',
  Twitch: 'https://twitch.tv/athenaus',
  X: 'https://x.com/athenaus',
};
