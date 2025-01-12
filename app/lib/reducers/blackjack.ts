import { INITIAL_STATE_BLK } from '@/constants/cards';
import { BlackjackStatus } from '@/enums/games';
import { PlayCard, BlackjackState, BlackjackAction } from '@/interfaces/games';
import { drawCard, getHandValue } from '@/lib/utils/cards';

const dealerPlay = (deck: PlayCard[], hand: PlayCard[]) => {
  let dealerHand = [...hand];
  let dealerTotal = getHandValue(dealerHand);

  while (dealerTotal < 17) {
    const newCard = drawCard(deck);
    dealerHand.push(newCard);
    dealerTotal = getHandValue(dealerHand);
  }

  return dealerHand;
};

export const blackjackReducer = (
  state: BlackjackState,
  action: BlackjackAction
): BlackjackState => {
  switch (action.type) {
    case 'BET_UPDATE':
      return {
        ...state,
        bet: action.payload,
      };

    case 'GAME_START':
      if (action.payload.bet > state.balance) {
        return {
          ...state,
          status: BlackjackStatus.Standby,
        };
      }

      const deck: PlayCard[] = [...action.payload.deck];

      const playerHand = [drawCard(deck), drawCard(deck)];
      const dealerHand = [drawCard(deck)];

      return {
        ...state,
        balance: state.balance - action.payload.bet,
        bet: action.payload.bet,
        deck: deck,
        playerHand: playerHand,
        dealerHand: dealerHand,
        status: BlackjackStatus.Playing,
      };

    case 'DOUBLE':
      if (state.deck.length === 0 || !state.bet) return state;

      const copyDeck = [...state.deck];
      const newPlayerHand = [...state.playerHand, drawCard(copyDeck)];

      const playerHandValue = getHandValue(newPlayerHand);

      const newDealerHand =
        playerHandValue < 21
          ? dealerPlay(copyDeck, state.dealerHand)
          : state.dealerHand;

      return {
        ...state,
        balance: state.balance - state.bet,
        bet: state.bet * 2,
        deck: copyDeck,
        dealerHand: newDealerHand,
        playerHand: newPlayerHand,
      };

    case 'HIT':
      if (state.deck.length === 0) return state;

      const updatedDeck = [...state.deck];
      const updatedPlayerHand = [...state.playerHand, drawCard(updatedDeck)];

      return {
        ...state,
        deck: updatedDeck,
        playerHand: updatedPlayerHand,
      };

    case 'STAND':
      const currentDeck = [...state.deck];
      const updatedDealerHand = dealerPlay(currentDeck, state.dealerHand);

      return {
        ...state,
        deck: currentDeck,
        dealerHand: updatedDealerHand,
      };

    case 'GAME_END':
      if (state.status === action.payload || !state.bet) return state;

      let blackjack = 0;
      let reward = 0;
      let win = 0;

      if (
        action.payload === BlackjackStatus.Win ||
        action.payload === BlackjackStatus.DealerBust
      ) {
        reward = state.bet * 2;
        win += 1;
      } else if (action.payload === BlackjackStatus.Blackjack) {
        blackjack += 1;
        reward = state.bet + Math.round(state.bet * 1.5);
        win += 1;
      } else if (action.payload === BlackjackStatus.Push) {
        reward = state.bet;
      }

      return {
        ...state,
        balance: state.balance + reward,
        status: action.payload,
      };

    case 'GAME_RESET':
      return {
        ...INITIAL_STATE_BLK,
        balance: state.balance,
        bet: state.bet,
      };

    default:
      return state;
  }
};
