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

const checkStatus = (
  playerHand: PlayCard[],
  dealerHand: PlayCard[]
): BlackjackStatus => {
  let status = BlackjackStatus.Playing;

  const playerHandValue = getHandValue(playerHand);
  const dealerHandValue = getHandValue(dealerHand);

  if (playerHandValue > 21) {
    status = BlackjackStatus.Bust;
  } else if (dealerHandValue > 21) {
    status = BlackjackStatus.DealerBust;
  } else if (playerHandValue === 21) {
    status = BlackjackStatus.Blackjack;
  } else if (dealerHandValue >= 17 && dealerHandValue > playerHandValue) {
    status = BlackjackStatus.Lose;
  } else if (dealerHandValue >= 17 && playerHandValue > dealerHandValue) {
    status = BlackjackStatus.Win;
  } else if (dealerHandValue >= 17 && dealerHandValue === playerHandValue) {
    status = BlackjackStatus.Push;
  }

  return status;
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
      const deck: PlayCard[] = [...action.payload.deck];

      const playerHand = [drawCard(deck), drawCard(deck)];
      const dealerHand = [drawCard(deck)];

      return {
        ...state,
        bet: action.payload.bet,
        deck: deck,
        double: false,
        playerHand: playerHand,
        dealerHand: dealerHand,
        status: checkStatus(playerHand, dealerHand),
      };

    case 'DOUBLE':
      if (state.deck.length === 0 || !state.bet) return state;

      const copyDeck = [...state.deck];
      const newPlayerHand = [...state.playerHand, drawCard(copyDeck)];

      const playerHandValue = getHandValue(newPlayerHand);

      const newDealerHand =
        playerHandValue < 21
          ? dealerPlay(copyDeck, [...state.dealerHand])
          : [...state.dealerHand];

      return {
        ...state,
        deck: copyDeck,
        double: true,
        dealerHand: newDealerHand,
        playerHand: newPlayerHand,
        status: checkStatus(newPlayerHand, newDealerHand),
      };

    case 'HIT':
      if (state.deck.length === 0) return state;

      const updatedDeck = [...state.deck];
      const updatedPlayerHand = [...state.playerHand, drawCard(updatedDeck)];

      return {
        ...state,
        deck: updatedDeck,
        playerHand: updatedPlayerHand,
        status: checkStatus(updatedPlayerHand, [...state.dealerHand]),
      };

    case 'STAND':
      const currentDeck = [...state.deck];
      const updatedDealerHand = dealerPlay(currentDeck, [...state.dealerHand]);

      return {
        ...state,
        deck: currentDeck,
        dealerHand: updatedDealerHand,
        status: checkStatus([...state.playerHand], updatedDealerHand),
      };

    case 'GAME_RESET':
      return {
        ...INITIAL_STATE_BLK,
        bet: state.bet,
      };

    default:
      return state;
  }
};
