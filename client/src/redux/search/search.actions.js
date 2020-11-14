import { SearchActionTypes } from './search.action-types';

export const setSearchQuery = (query) => ({
  type: SearchActionTypes.SET_SEARCH_QUERY,
  payload: query,
});
