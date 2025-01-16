import { BlackjackStatus } from '@/enums/games';
import { BlackjackState } from '@/interfaces/games';

export const INITIAL_STATE_BLK: BlackjackState = {
  bet: 100,
  deck: [],
  double: false,
  playerHand: [],
  dealerHand: [],
  status: BlackjackStatus.Standby,
};

export const GAME_OVER_STATUS_BLK = [
  BlackjackStatus.Blackjack,
  BlackjackStatus.Bust,
  BlackjackStatus.DealerBust,
  BlackjackStatus.Lose,
  BlackjackStatus.Push,
  BlackjackStatus.Win,
];
