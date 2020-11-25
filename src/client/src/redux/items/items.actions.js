import { ItemsActionTypes } from './items.action-types';

export const setCurrentItems = (items) => ({
  type: ItemsActionTypes.SET_CURRENT_ITEMS,
  payload: items,
});

export const setCurrentItem = (item) => ({
  type: ItemsActionTypes.SET_CURRENT_ITEM,
  payload: item,
});

export const startLoadingItems = () => ({
  type: ItemsActionTypes.LOAD_ITEMS,
  payload: true,
});

export const finishLoadingItems = () => ({
  type: ItemsActionTypes.LOAD_ITEMS,
  payload: false,
});

export const setTotalItems = (numberOfItems) => ({
  type: ItemsActionTypes.SET_TOTAL_ITEMS,
  payload: numberOfItems,
});

export const setCurrentPage = (pageIndex) => ({
  type: ItemsActionTypes.SET_CURRENT_PAGE,
  payload: pageIndex,
});
