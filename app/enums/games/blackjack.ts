export enum BlackjackStatus {
  Standby, // no game has started
  Playing, // currently playing the game
  Blackjack, // player won by Blackjack
  Win, // player has won by being closer to 21
  DealerBust, // player has won by dealer bust
  Push, // the game was tied
  Bust, // player lost by bust
  Lose, // player lost by having less than dealer
}
