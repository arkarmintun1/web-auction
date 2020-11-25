import { createSelector } from 'reselect';

const selectQuery = (state) => state.search;

export const selectSearchQuery = createSelector(
  [selectQuery],
  (search) => search.query
);
