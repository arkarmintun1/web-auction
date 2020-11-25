import { UserActionTypes } from './user.action-types';

const INITIAL_STATE = {
  currentUser: null,
  accessToken: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.SET_CURRENT_USER: {
      return {
        ...state,
        currentUser: action.payload,
      };
    }
    case UserActionTypes.SET_ACCESS_TOKEN: {
      return {
        ...state,
        accessToken: action.payload,
      };
    }
    default:
      return state;
  }
};

export default userReducer;
