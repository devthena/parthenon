export enum BlackjackStatus {
  Standby = 'Standby', // no game has started
  Playing = 'Playing', // currently playing the game
  Blackjack = 'Blackjack', // player won by Blackjack
  Win = 'Win', // player has won by being closer to 21
  DealerBust = 'DealerBust', // player has won by dealer bust
  Push = 'Push', // the game was tied
  Bust = 'Bust', // player lost by bust
  Lose = 'Lose', // player lost by having less than dealer
}

export enum CardSize {
  Large, // regular
  Medium, // size to fit 5 cards
  Small, // size to fit 6 cards
  XSmall, // size to fit 7 cards
}
