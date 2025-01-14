import { CardRank, CardSuit } from '@/interfaces/games';

export * from './blackjack';

export const CARD_RANKS: CardRank[] = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
];

export const CARD_SUITS: CardSuit[] = ['clubs', 'diamonds', 'hearts', 'spades'];
