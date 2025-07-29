'use client';

import { useCallback, useReducer } from 'react';

import { INITIAL_STATE_WDL } from '@/constants/wordle';
import { wordleReducer } from '@/lib/reducers';

export const useWordle = () => {
  const [state, dispatch] = useReducer(wordleReducer, INITIAL_STATE_WDL);

  const onPlay = useCallback(() => {
    dispatch({ type: 'play' });
  }, []);

  const onDelete = useCallback(() => {
    dispatch({ type: 'delete' });
  }, []);

  const onEnter = useCallback(() => {
    dispatch({ type: 'enter' });
  }, []);

  const onKey = useCallback((letter: string) => {
    dispatch({ type: 'key', letter: letter });
  }, []);

  const onReset = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  const onResume = useCallback(() => {
    dispatch({ type: 'resume' });
  }, []);

  return {
    ...state,
    onDelete,
    onEnter,
    onKey,
    onPlay,
    onReset,
    onResume,
  };
};
