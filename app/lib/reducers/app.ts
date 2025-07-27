import { ParthenonAction, ParthenonState } from '@/interfaces/context';

export const partheonReducer = (
  state: ParthenonState,
  action: ParthenonAction
): ParthenonState => {
  switch (action.type) {
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
        user: action.payload,
      };
    default:
      return state;
  }
};
