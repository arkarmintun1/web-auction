import { createSelector } from 'reselect';

const selectItems = (state) => state.items;

export const selectCurrentItems = createSelector(
  [selectItems],
  (items) => items.currentItems
);

export const selectCurrentItem = createSelector(
  [selectItems],
  (items) => items.currentItem
);

export const selectLoadingStatus = createSelector(
  [selectItems],
  (items) => items.loadItems
);

export const selectTotalItems = createSelector(
  [selectItems],
  (items) => items.totalItems
);

export const selectCurrentPage = createSelector(
  [selectItems],
  (items) => items.currentPage
);
