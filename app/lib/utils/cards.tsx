import { CARD_RANKS, CARD_SUITS } from '@/constants/cards';
import { BlackjackStatus, CardSize } from '@/enums/games';
import { CardSuit, PlayCard } from '@/interfaces/games';

import {
  ClubsIcon,
  DiamondsIcon,
  HeartsIcon,
  SpadesIcon,
} from '@/images/icons';

export const createCardDeck = (): PlayCard[] => {
  const deck: PlayCard[] = [];

  CARD_SUITS.forEach(suit => {
    CARD_RANKS.forEach(rank => {
      deck.push({
        rank: rank,
        size: CardSize.Large,
        suit: suit,
      });
    });
  });

  return deck;
};

export const drawCard = (deck: PlayCard[]): PlayCard => {
  const card = deck[0];
  deck.splice(0, 1);

  return card;
};

export const getHandValue = (hand: PlayCard[]) => {
  let total = 0;
  let aces = 0;

  for (let card of hand) {
    if (card.rank === 'A') {
      aces += 1;
      total += 11; // Start with Ace being 11
    } else if (['K', 'Q', 'J'].includes(card.rank)) {
      total += 10; // Face cards are worth 10
    } else {
      total += parseInt(card.rank); // Numeric cards
    }
  }

  // Adjust for Aces if total exceeds 21
  while (total > 21 && aces > 0) {
    total -= 10; // Change one Ace from 11 to 1
    aces -= 1;
  }

  return total;
};

export const getBlackjackResult = (result: BlackjackStatus): string => {
  switch (result) {
    case BlackjackStatus.Blackjack:
      return 'BLACKJACK';
    case BlackjackStatus.Bust:
      return 'BUST';
    case BlackjackStatus.DealerBust:
      return 'DEALER BUST';
    case BlackjackStatus.Lose:
      return 'YOU LOSE';
    case BlackjackStatus.Win:
      return 'YOU WIN';
    case BlackjackStatus.Push:
      return 'PUSH';
    default:
      return '';
  }
};

export const getSuitSVG = (suit: CardSuit) => {
  switch (suit) {
    case 'clubs':
      return <ClubsIcon />;
    case 'diamonds':
      return <DiamondsIcon />;
    case 'hearts':
      return <HeartsIcon />;
    case 'spades':
      return <SpadesIcon />;
    default:
      return <SpadesIcon />;
  }
};

export const shuffleDeck = (deck: PlayCard[]): PlayCard[] => {
  // Fisher-Yates Shuffle Algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};
