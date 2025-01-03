import { ADD_ITEM, EDIT_ITEM, DELETE_ITEM, SET_ITEMS } from './actions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  items: []
};

export default function shoppingListReducer(state = initialState, action) {
  let newState;
  
  switch (action.type) {
    case SET_ITEMS:
      newState = {
        ...state,
        items: action.payload
      };
      break;
      
    case ADD_ITEM:
      newState = {
        ...state,
        items: [...state.items, { id: Date.now(), ...action.payload }]
      };
      break;
      
    case EDIT_ITEM:
      newState = {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.item } : item
        )
      };
      break;
      
    case DELETE_ITEM:
      newState = {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
      break;
      
    default:
      return state;
  }
  
  // Save to AsyncStorage after each state change
  AsyncStorage.setItem('shoppingList', JSON.stringify(newState.items));
  return newState;
}