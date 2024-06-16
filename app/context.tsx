'use client';

import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from 'react';
import { UserObject } from './lib/types/db';

interface ParthenonState {
  isFetched: boolean;
  isLoading: boolean;
  user: UserObject | null;
}

type ParthenonAction =
  | { type: 'set_loading' }
  | { type: 'set_user'; payload: UserObject | null };

const initialState: ParthenonState = {
  isFetched: false,
  isLoading: false,
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
    case 'set_loading':
      return {
        ...state,
        isLoading: true,
      };
    case 'set_user':
      return {
        ...state,
        isLoading: false,
        isFetched: true,
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
  return context;
};

export { ParthenonProvider, useParthenonState };
