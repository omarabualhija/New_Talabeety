import { Alert } from 'react-native';
import {
  LOGOUT,
  SAVE_USER,
  SAVE_CITY,
  ADD_TO_CART,
  CLEAR_CART,
  ON_ITEM_MINUS,
  ON_ITEM_PLUS,
  ON_ITEM_REMOVE,
  SAVE_CITIES,
  SHOW_NOTIFICATION,
  ITEM_NOTE,
  CART_ITEM_CHECK,
  GET_CART_USER,

} from '../actions/types';

const initialState = {
  user: null,
  isLoggedIn: false,
  cart: null,
  city: null,
  cities: null,
  showNotification: false,
  cartUser:[]
};

let _cart = null;
let item = null;

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_USER:
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
      };
    case ADD_TO_CART:
      _cart = state.cart
        ? {...state.cart}
        : {store: action.payload.store, items: [], itemsQty: 0, totalPrice: 0};
      _cart.items.push(action.payload.item);
      _cart.itemsQty += action.payload.item.quantity;
      _cart.totalPrice +=
        action.payload.item.quantity * action.payload.item.Price;
      return {
        ...state,
        cart: _cart,
      };
    case ON_ITEM_PLUS:
      _cart = {...state.cart};
      for (let i = 0; i < _cart.items.length; i++) {
        item = _cart.items[i];
        if (item.ID === action.payload) {
          if (item.quantity < item.MaxQuantity) {
            // if quantity less than maximum quantity
            _cart.totalPrice = _cart.totalPrice + item.Price;
            _cart.itemsQty = _cart.itemsQty + 1;
            item.quantity = item.quantity + 1;
          }
          break;
        }
      }

      return {
        ...state,
        cart: _cart,
      };
    case ON_ITEM_MINUS:
      _cart = {...state.cart};
      for (let i = 0; i < _cart.items.length; i++) {
        item = _cart.items[i];
        if (item.ID === action.payload) {
          if (item.quantity === 1) {
            _cart.items.splice(i, 1);
          } else {
            item.quantity = item.quantity - 1;
          }
          break;
        }
      }
      if (_cart.items.length === 0) {
        _cart = null;
      } else {
        _cart.totalPrice -= item.Price;
        _cart.itemsQty -= -1;
      }
      return {
        ...state,
        cart: _cart,
      };
    case ON_ITEM_REMOVE:
      _cart = {...state.cart};
      for (let i = 0; i < _cart.items.length; i++) {
        item = _cart.items[i];
        if (item.ID === action.payload) {
          _cart.items.splice(i, 1);
          break;
        }
      }
      if (_cart.items.length === 0) {
        _cart = null;
      } else {
        _cart.totalPrice = _cart.totalPrice - item.Price * item.quantity;
        _cart.itemsQty = _cart.itemsQty - item.quantity;
      }
      return {
        ...state,
        cart: _cart,
      };
    case CART_ITEM_CHECK:
      _cart = {...state.cart};
      for (let i = 0; i < _cart.items.length; i++) {
        item = _cart.items[i];
        if (item.ID === action.payload.ID) {
          item.isChecked = action.payload.value;
          break;
        }
      }

      return {
        ...state,
        cart: _cart,
      };
    case CLEAR_CART:
      return {
        ...state,
        cart: null,
      };
    case SAVE_CITY:
      return {
        ...state,
        city: action.payload,
      };
    case SAVE_CITIES:
      return {
        ...state,
        cities: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        isLoggedIn: false,
        cart: null,
      };
    case ITEM_NOTE:
      _cart = {...state.cart};
      for (let i = 0; i < _cart.items.length; i++) {
        item = _cart.items[i];
        if (item.ID === action.payload.ID) {
          item.notes = action.payload.Note;
        }
      }

      return {
        ...state,
        cart: _cart,
      };

    case SHOW_NOTIFICATION:
      return {
        ...state,
        showNotification: action.payload,
      };

      case GET_CART_USER:{
       
        return {...state,cartUser:[...action.payload.productsCart]}
      }
    default:
      return state;
  }
};

export default Reducer;
