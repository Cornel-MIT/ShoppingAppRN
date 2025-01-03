export const ADD_ITEM = 'ADD_ITEM';
export const EDIT_ITEM = 'EDIT_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
export const SET_ITEMS = 'SET_ITEMS';
export const TOGGLE_PURCHASED = 'TOGGLE_PURCHASED';

export const addItem = (item) => ({
  type: ADD_ITEM,
  payload: item
});

export const editItem = (id, item) => ({
  type: EDIT_ITEM,
  payload: { id, item }
});

export const deleteItem = (id) => ({
  type: DELETE_ITEM,
  payload: id
});

export const setItems = (items) => ({
  type: SET_ITEMS,
  payload: items
});

export const togglePurchased = (id) => ({
  type: TOGGLE_PURCHASED,
  payload: id
});