import { ADD_ITEM, EDIT_ITEM, DELETE_ITEM } from './actions';

const initialState = {
  items: []
};

export default function shoppingListReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ITEM:
      return {
        ...state,
        items: [...state.items, { id: Date.now(), ...action.payload }]
      };
    case EDIT_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.item } : item
        )
      };
    case DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    default:
      return state;
  }
}