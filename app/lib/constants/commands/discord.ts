export const DISCORD_COMMANDS = [
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
    note: 'Note: Global Command',
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
