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
    note: 'Accepted Values: <positive number> | half | all',
  },
  {
    name: '/give',
    sub: '<@member> <value>',
    description: 'Give your points to another user',
    note: 'Accepted Value: <positive number>',
  },
  {
    name: '/help',
    description: 'Display the links for Commands and FAQ',
  },
  {
    name: '/leaderboard',
    description: 'Display the top five users with the most coins',
  },
  {
    name: '/link',
    sub: '<value>',
    description: 'Merge your Discord and Twitch accounts',
    note: 'Accepted Value: <code>',
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
  {
    name: '/unlink',
    description: 'Separate your Discord and Twitch accounts',
  },
];

export const CommandsTwitch = [
  {
    name: '!commands',
    description: 'Displays the link for the list of all commands',
  },
  {
    name: '!gamble',
    sub: '<value>',
    description: 'Play your points for a chance to double it',
    note: 'Accepted Values: <positive number> | half | all',
  },
  {
    name: '!give',
    sub: '<@member> <value>',
    description: 'Give your points to another user',
    note: 'Accepted Value: <positive number>',
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
  // @todo: Add back once Wordle is ready for release
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
  Discord: 'https://discord.gg/athenaus',
  Github: 'https://github.com/devthena',
  Instagram: 'https://instagram.com/thena.us',
  Twitch: 'https://twitch.tv/athenaus',
  X: 'https://x.com/athenaus',
};
