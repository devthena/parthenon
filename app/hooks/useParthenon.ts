import { useCallback, useContext } from 'react';

import { ModalState } from '@/interfaces/modal';
import { UserDocument } from '@/interfaces/user';

import { ParthenonContext } from '@/lib/context';

export const useParthenon = () => {
  const context = useContext(ParthenonContext);

  if (context === undefined) {
    throw new Error(
      'useParthenonState must be used within a ParthenonProvider'
    );
  }

  const { state, dispatch } = context;

  const setStateModal = useCallback(
    (modal: ModalState) => {
      dispatch({ type: 'SET_MODAL', payload: modal });
    },
    [dispatch]
  );

  const setStateUser = useCallback(
    (user: UserDocument) => {
      dispatch({ type: 'SET_USER', payload: user });
    },
    [dispatch]
  );

  return {
    ...state,
    setStateModal,
    setStateUser,
  };
};
