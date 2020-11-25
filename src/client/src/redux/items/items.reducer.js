import { ItemsActionTypes } from './items.action-types';

const INITIAL_STATE = {
  currentItems: [],
  loadItems: false,
  totalItems: 0,
  currentPage: 1,
  currentItem: {},
};

const itemsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ItemsActionTypes.SET_CURRENT_ITEMS: {
      return {
        ...state,
        currentItems: action.payload,
      };
    }
    case ItemsActionTypes.SET_CURRENT_ITEM: {
      return {
        ...state,
        currentItem: action.payload,
      };
    }
    case ItemsActionTypes.LOAD_ITEMS: {
      return {
        ...state,
        loadItems: action.payload,
      };
    }
    case ItemsActionTypes.SET_TOTAL_ITEMS: {
      return {
        ...state,
        totalItems: action.payload,
      };
    }
    case ItemsActionTypes.SET_CURRENT_PAGE: {
      return {
        ...state,
        currentPage: action.payload,
      };
    }
    default:
      return state;
  }
};

export default itemsReducer;
