'use client';

import { createContext, ReactNode, useReducer } from 'react';

import { INITIAL_STATE } from '@/constants/context';
import { ParthenonContextType } from '@/interfaces/context';
import { partheonReducer } from '@/lib/reducers';

export const ParthenonContext = createContext<ParthenonContextType | undefined>(
  undefined
);

export const ParthenonProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(partheonReducer, INITIAL_STATE);

  return (
    <ParthenonContext.Provider value={{ state, dispatch }}>
      {children}
    </ParthenonContext.Provider>
  );
};
