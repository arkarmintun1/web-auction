import { SearchActionTypes } from './search.action-types';

const INITIAL_STATE = {
  query: '',
};

const searchReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SearchActionTypes.SET_SEARCH_QUERY: {
      return {
        ...state,
        query: action.payload,
      };
    }
    default:
      return state;
  }
};

export default searchReducer;
