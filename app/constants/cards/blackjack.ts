import { BlackjackStatus } from '@/enums/games';
import { BlackjackState } from '@/interfaces/games';

export const INITIAL_STATE_BLK: BlackjackState = {
  balance: 1000,
  bet: 100,
  deck: [],
  playerHand: [],
  dealerHand: [],
  status: BlackjackStatus.Standby,
};
