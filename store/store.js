import { createStore } from 'redux';
import shoppingListReducer from './reducer';

export const store = createStore(shoppingListReducer);
