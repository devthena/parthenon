'use client';

import {
  Dispatch,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from 'react';

import { ApiUrl } from './lib/enums/api';
import { DataObject, StarObject, UserObject } from './lib/types/db';
import { useApi } from './hooks';

interface ParthenonState {
  isFetched: boolean;
  isLoading: boolean;
  stars: StarObject | null;
  user: UserObject | null;
}

type ParthenonAction =
  | { type: 'set_loading' }
  | { type: 'set_data'; payload: DataObject | null }
  | { type: 'update_user'; payload: UserObject | null };

const initialState: ParthenonState = {
  isFetched: false,
  isLoading: false,
  stars: null,
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
    case 'set_data':
      return {
        ...state,
        isLoading: false,
        isFetched: true,
        user: action.payload?.user ?? null,
        stars: action.payload?.stars ?? null,
      };
    case 'set_loading':
      return {
        ...state,
        isLoading: true,
      };
    case 'update_user':
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
  const { saveData } = useApi();

  if (context === undefined) {
    throw new Error(
      'useParthenonState must be used within a ParthenonProvider'
    );
  }

  const { state, dispatch } = context;

  const onSetLoading = useCallback(() => {
    dispatch({ type: 'set_loading' });
  }, [dispatch]);

  const onSetData = useCallback(
    (data: DataObject | null) => {
      dispatch({ type: 'set_data', payload: data });
    },
    [dispatch]
  );

  const onUpdateUser = useCallback(
    (user: UserObject | null) => {
      dispatch({ type: 'update_user', payload: user });
    },
    [dispatch]
  );

  const saveUser = useCallback(async () => {
    if (!state.user) return;

    try {
      const { _id, ...modifiedUser } = state.user;

      await saveData(ApiUrl.Users, modifiedUser);
    } catch (error) {
      throw new Error('Hook Error: useParthenonState (saveUser)');
    }
  }, [state.user, saveData]);

  return {
    ...state,
    onSetLoading,
    onSetData,
    onUpdateUser,
    saveUser,
  };
};

export { ParthenonProvider, useParthenonState };
