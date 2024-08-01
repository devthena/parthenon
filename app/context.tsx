'use client';

import {
  Dispatch,
  ReactElement,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from 'react';

import { GameObject } from '@/interfaces/games';
import { UserObject } from '@/interfaces/user';
import { StatsObject } from '@/interfaces/statistics';

interface ParthenonState {
  isFetched: boolean;
  isLoading: boolean;
  modal: ModalState;
  games: GameObject;
  stats: StatsObject;
  user: UserObject | null;
}

interface ModalState {
  isOpen: boolean;
  content: ReactElement | null;
}

type ParthenonAction =
  | { type: 'init_user'; payload: UserObject | null }
  | { type: 'set_loading' }
  | { type: 'set_modal'; payload: Partial<ModalState> }
  | { type: 'set_game'; payload: GameObject }
  | { type: 'set_stats'; payload: StatsObject }
  | { type: 'set_user'; payload: UserObject };

const initialState: ParthenonState = {
  isFetched: false,
  isLoading: false,
  modal: { isOpen: false, content: null },
  games: {},
  stats: {},
  user: null,
};

const ParthenonContext = createContext<
  { state: ParthenonState; dispatch: Dispatch<ParthenonAction> } | undefined
>(undefined);

const reducer = (
  state: ParthenonState,
  action: ParthenonAction
): ParthenonState => {
  switch (action.type) {
    case 'init_user':
      return {
        ...state,
        isFetched: true,
        isLoading: false,
        user: action.payload,
      };
    case 'set_loading':
      return {
        ...state,
        isLoading: true,
      };
    case 'set_modal':
      return {
        ...state,
        modal: {
          ...state.modal,
          ...action.payload,
        },
      };
    case 'set_game':
      return {
        ...state,
        games: {
          ...state.games,
          ...action.payload,
        },
      };
    case 'set_stats':
      return {
        ...state,
        stats: {
          ...state.stats,
          ...action.payload,
        },
      };
    case 'set_user':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const ParthenonProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <ParthenonContext.Provider value={{ state, dispatch }}>
      {children}
    </ParthenonContext.Provider>
  );
};

const useParthenonState = () => {
  const context = useContext(ParthenonContext);

  if (context === undefined) {
    throw new Error(
      'useParthenonState must be used within a ParthenonProvider'
    );
  }

  const { state, dispatch } = context;

  const onInitUser = useCallback(
    (user: UserObject | null) => {
      dispatch({ type: 'init_user', payload: user });
    },
    [dispatch]
  );

  const onSetLoading = useCallback(() => {
    dispatch({ type: 'set_loading' });
  }, [dispatch]);

  const onSetModal = useCallback(
    (modal: Partial<ModalState>) => {
      dispatch({ type: 'set_modal', payload: modal });
    },
    [dispatch]
  );

  const onSetGame = useCallback(
    (game: GameObject) => {
      dispatch({ type: 'set_game', payload: game });
    },
    [dispatch]
  );

  const onSetStats = useCallback(
    (stats: StatsObject) => {
      dispatch({ type: 'set_stats', payload: stats });
    },
    [dispatch]
  );

  const onSetUser = useCallback(
    (user: UserObject) => {
      dispatch({ type: 'set_user', payload: user });
    },
    [dispatch]
  );

  return {
    ...state,
    onInitUser,
    onSetLoading,
    onSetModal,
    onSetGame,
    onSetStats,
    onSetUser,
  };
};

export { ParthenonProvider, useParthenonState };
