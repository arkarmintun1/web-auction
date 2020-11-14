import { combineReducers } from 'redux';

import userReducer from './user/user.reducer';
import searchReducer from './search/search.reducer';
import itemsReducer from './items/items.reducer';

const rootReducer = combineReducers({
  user: userReducer,
  search: searchReducer,
  items: itemsReducer,
});

export default rootReducer;
