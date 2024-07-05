import { useCallback, useReducer } from 'react';

import {
  AnswerList,
  MaxAttempts,
  WordLength,
  WordList,
  WordleRewards,
} from '../lib/constants/wordle';

import { KeyStatus, ModalContent, WordleStatus } from '../lib/enums/wordle';
import { Guess, WordleState } from '../lib/types/wordle';

type WordleAction =
  | { type: 'delete' }
  | { type: 'enter' }
  | { type: 'key'; letter: string }
  | { type: 'modal_close' }
  | { type: 'modal_rules' }
  | { type: 'modal_stats' }
  | { type: 'reset' }
  | { type: 'resume' };

const getLetterResult = (
  guess: string[],
  answer: string,
  keyResults: { [key: string]: string }
): KeyStatus[] => {
  const result: KeyStatus[] = Array(guess.length).fill(KeyStatus.Absent);
  const answerArray = answer.split('');
  const guessArray = [...guess];

  // first pass: check for correct letters
  for (let i = 0; i < guessArray.length; i++) {
    if (guessArray[i] === answerArray[i]) {
      result[i] = KeyStatus.Correct;
      keyResults[guessArray[i]] = KeyStatus.Correct;
      answerArray[i] = '';
      guessArray[i] = '';
    } else {
      if (
        keyResults[guessArray[i]] !== KeyStatus.Correct &&
        keyResults[guessArray[i]] !== KeyStatus.Present
      ) {
        keyResults[guessArray[i]] = KeyStatus.Absent;
      }
    }
  }

  // second pass: check for present letters
  for (let i = 0; i < guessArray.length; i++) {
    if (guessArray[i] !== '' && answerArray.includes(guessArray[i])) {
      const letterIndex = answerArray.indexOf(guessArray[i]);

      result[i] = KeyStatus.Present;
      answerArray[letterIndex] = '';

      if (keyResults[guessArray[i]] !== KeyStatus.Correct) {
        keyResults[guessArray[i]] = KeyStatus.Present;
      }
    }
  }

  return result;
};

const wordleReducer = (
  state: WordleState,
  action: WordleAction
): WordleState => {
  const isGameOver =
    state.status === WordleStatus.Answered ||
    state.status === WordleStatus.Completed;

  switch (action.type) {
    case 'key':
      if (!isGameOver && state.currentGuess.length < WordLength) {
        return {
          ...state,
          currentGuess: state.currentGuess + action.letter,
        };
      } else {
        return state;
      }
    case 'delete':
      if (!isGameOver) {
        return {
          ...state,
          currentGuess: state.currentGuess.slice(0, -1),
        };
      } else {
        return state;
      }
    case 'enter':
      if (!isGameOver) {
        if (state.currentGuess.length === WordLength) {
          if (!WordList.includes(state.currentGuess)) {
            return {
              ...state,
              status: WordleStatus.InvalidWord,
            };
          }

          const newKeyResults = { ...state.keyResults };

          const result = getLetterResult(
            state.currentGuess.split(''),
            state.answer,
            newKeyResults
          );

          const newGuess: Guess = { word: state.currentGuess, result };
          const newGuesses = [...state.guesses, newGuess];

          const newStatus =
            state.currentGuess === state.answer
              ? WordleStatus.Answered
              : newGuesses.length >= MaxAttempts
              ? WordleStatus.Completed
              : WordleStatus.Playing;

          const newReward =
            newStatus === WordleStatus.Answered
              ? WordleRewards[newGuesses.length - 1]
              : null;

          return {
            ...state,
            currentGuess: '',
            guesses: newGuesses,
            keyResults: newKeyResults,
            reward: newReward,
            status: newStatus,
          };
        } else {
          return {
            ...state,
            status: WordleStatus.InvalidGuess,
          };
        }
      } else {
        return { ...initialState, answer: generateAnswer() };
      }
    case 'modal_close':
      return {
        ...state,
        modalDisplay: false,
      };
    case 'modal_rules':
      return {
        ...state,
        modalContent: ModalContent.Rules,
        modalDisplay: true,
      };
    case 'modal_stats':
      return {
        ...state,
        modalContent: ModalContent.Stats,
        modalDisplay: true,
      };
    case 'reset':
      return { ...initialState, answer: generateAnswer() };
    case 'resume':
      return {
        ...state,
        status: WordleStatus.Playing,
      };
    default:
      return state;
  }
};

const generateAnswer = () => {
  const i = Math.floor(Math.random() * AnswerList.length);
  return AnswerList[i];
};

const initialState: WordleState = {
  answer: generateAnswer(),
  currentGuess: '',
  guesses: [],
  keyResults: {},
  modalContent: ModalContent.Rules,
  modalDisplay: false,
  reward: null,
  status: WordleStatus.Playing,
};

export const useWordle = () => {
  const [state, dispatch] = useReducer(wordleReducer, initialState);

  const onDelete = useCallback(() => {
    dispatch({ type: 'delete' });
  }, []);

  const onEnter = useCallback(() => {
    dispatch({ type: 'enter' });
  }, []);

  const onKey = useCallback((letter: string) => {
    dispatch({ type: 'key', letter: letter });
  }, []);

  const onModalClose = useCallback(() => {
    dispatch({ type: 'modal_close' });
  }, []);

  const onModalRules = useCallback(() => {
    dispatch({ type: 'modal_rules' });
  }, []);

  const onModalStats = useCallback(() => {
    dispatch({ type: 'modal_stats' });
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
    onModalClose,
    onModalRules,
    onModalStats,
    onReset,
    onResume,
  };
};
