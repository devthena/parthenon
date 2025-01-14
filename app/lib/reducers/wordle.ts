import {
  ANSWER_LIST,
  INITIAL_STATE_WDL,
  MAX_ATTEMPTS,
  WORD_LENGTH,
  WORD_LIST,
  WORDLE_REWARDS,
} from '@/constants/wordle';

import { WordleKeyStatus, WordleStatus } from '@/enums/games';
import { WordleAction, WordleGuess, WordleState } from '@/interfaces/games';

const generateAnswer = () => {
  const i = Math.floor(Math.random() * ANSWER_LIST.length);
  return ANSWER_LIST[i];
};

const getLetterResult = (
  guess: string[],
  answer: string,
  keyResults: { [key: string]: string }
): WordleKeyStatus[] => {
  const result: WordleKeyStatus[] = Array(guess.length).fill(
    WordleKeyStatus.Absent
  );
  const answerArray = answer.split('');
  const guessArray = [...guess];

  // reset keyboard tile colors for current guess
  for (let i = 0; i < guessArray.length; i++) {
    keyResults[guessArray[i]] = WordleKeyStatus.Absent;
  }

  // first pass: check for correct letters
  for (let i = 0; i < guessArray.length; i++) {
    if (guessArray[i] === answerArray[i]) {
      result[i] = WordleKeyStatus.Correct;
      keyResults[guessArray[i]] = WordleKeyStatus.Correct;
      answerArray[i] = '';
      guessArray[i] = '';
    } else {
      if (
        keyResults[guessArray[i]] !== WordleKeyStatus.Correct &&
        keyResults[guessArray[i]] !== WordleKeyStatus.Present
      ) {
        keyResults[guessArray[i]] = WordleKeyStatus.Absent;
      }
    }
  }

  // second pass: check for present letters
  for (let i = 0; i < guessArray.length; i++) {
    if (guessArray[i] !== '' && answerArray.includes(guessArray[i])) {
      const letterIndex = answerArray.indexOf(guessArray[i]);

      result[i] = WordleKeyStatus.Present;
      answerArray[letterIndex] = '';

      if (keyResults[guessArray[i]] !== WordleKeyStatus.Correct) {
        keyResults[guessArray[i]] = WordleKeyStatus.Present;
      }
    }
  }

  return result;
};

export const wordleReducer = (
  state: WordleState,
  action: WordleAction
): WordleState => {
  const isGameOver =
    state.status === WordleStatus.Answered ||
    state.status === WordleStatus.Completed;

  switch (action.type) {
    case 'play':
      return {
        ...INITIAL_STATE_WDL,
        status: WordleStatus.Playing,
        answer: generateAnswer(),
      };
    case 'key':
      if (
        !isGameOver &&
        state.currentGuess.length < WORD_LENGTH &&
        state.status !== WordleStatus.Standby
      ) {
        return {
          ...state,
          currentGuess: state.currentGuess + action.letter,
        };
      } else {
        return state;
      }
    case 'delete':
      if (!isGameOver && state.status !== WordleStatus.Standby) {
        return {
          ...state,
          currentGuess: state.currentGuess.slice(0, -1),
        };
      } else {
        return state;
      }
    case 'enter':
      if (state.currentGuess.length === WORD_LENGTH) {
        if (!WORD_LIST.includes(state.currentGuess)) {
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

        const newGuess: WordleGuess = { word: state.currentGuess, result };
        const newGuesses = [...state.guesses, newGuess];

        const newStatus =
          state.currentGuess === state.answer
            ? WordleStatus.Answered
            : newGuesses.length >= MAX_ATTEMPTS
            ? WordleStatus.Completed
            : WordleStatus.Playing;

        const newReward =
          newStatus === WordleStatus.Answered
            ? WORDLE_REWARDS[newGuesses.length - 1]
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
    case 'reset':
      return { ...INITIAL_STATE_WDL };
    case 'resume':
      return { ...state, status: WordleStatus.Playing };
    default:
      return state;
  }
};
