export type CardSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export type CardRank =
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K'
  | 'A';

export interface PlayCard {
  small?: boolean;
  suit: CardSuit;
  rank: CardRank;
}

export type CardDeck = PlayCard[];
