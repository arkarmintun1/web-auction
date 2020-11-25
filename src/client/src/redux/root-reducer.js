import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import userReducer from './user/user.reducer';
import searchReducer from './search/search.reducer';
import itemsReducer from './items/items.reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  user: userReducer,
  search: searchReducer,
  items: itemsReducer,
});

export default persistReducer(persistConfig, rootReducer);
