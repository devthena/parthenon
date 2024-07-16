import { GameCode } from '@/enums/games';

export const GAME_REWARDS = {
  [GameCode.Wordle]: [
    { label: 'xvi', value: 50 },
    { label: 'xxv', value: 100 },
    { label: 'xiv', value: 250 },
    { label: 'iii', value: 500 },
    { label: 'xii', value: 1000 },
    { label: 'xxi', value: 10000 },
  ],
};
