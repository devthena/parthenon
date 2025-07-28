import { GameCode } from '@/enums/games';
import { ParthenonAction, ParthenonState } from '@/interfaces/context';
import { GameDocument } from '@/interfaces/games';

export const partheonReducer = (
  state: ParthenonState,
  action: ParthenonAction
): ParthenonState => {
  switch (action.type) {
    case 'SET_ACTIVE_GAME':
      return {
        ...state,
        activeGames: {
          ...state.activeGames,
          [action.payload.code]: action.payload.data,
        },
      };
    case 'SET_ACTIVE_GAMES':
      const updatedActiveGames: Partial<Record<GameCode, GameDocument>> = {};

      action.payload.forEach(game => {
        updatedActiveGames[game.code] = game;
      });

      return {
        ...state,
        activeGames: updatedActiveGames,
        isActiveGamesFetched: true,
      };
    case 'SET_MODAL':
      return {
        ...state,
        modal: {
          ...state.modal,
          ...action.payload,
        },
      };
    case 'SET_USER':
      return {
        ...state,
        isUserFetched: true,
        user: action.payload,
      };
    default:
      return state;
  }
};
