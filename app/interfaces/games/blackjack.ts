export type BlackjackSuit = 'hearts' | 'diamonds' | 'clubs' | 'spades';

export type BlackjackRank =
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

export interface BlackjackCard {
  small?: boolean;
  suit: BlackjackSuit;
  rank: BlackjackRank;
}

export type BlackjackDeck = BlackjackCard[];

export interface BlackjackObject {
  totalBlackjack: number;
  totalPlayed: number;
  totalWon: number;
}

export interface BlackjackState {
  balance: number;
  bet: number | null;
  deck: BlackjackDeck;
  playerHand: BlackjackCard[];
  dealerHand: BlackjackCard[];
}
