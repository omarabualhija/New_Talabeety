import {Alert} from 'react-native';
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
  //edit by omar
  cart: [], //cartItem=[{prodID: '', qnt: 1}],
  city: null,
  cities: null,
  showNotification: false,
  totalCart: 0,
  cartUser: [],
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
      let isExisted = state.cart?.some((i, index) => {
        return i.prod.ID == payload.ID;
      });

      return {
        ...state,
        cart: isExisted
          ? state.cart.map(i =>
              i.prod.ID == payload.ID ? {...i, qnt: i.qnt + 1} : i,
            )
          : [...state.cart, {prod: payload, qnt: 1}],
      };

    case ON_ITEM_MINUS:
      let _cart = state.cart
        .map(i =>
          i.prod.ID == payload.ID
            ? i.qnt != 0
              ? {...i, qnt: i.qnt - 1}
              : {...i, qnt: 0}
            : i,
        )
        .filter(i => i.qnt !== 0);
      return {
        ...state,

        cart: _cart,
      };
    case ON_ITEM_REMOVE:
      return {
        ...state,

        cart: state.cart.filter(i => i.prod.ID !== payload.ID),
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

    case GET_CART_USER: {
      return {...state, cartUser: [...action.payload.productsCart]};
    }
    default:
      return state;
  }
};

export default Reducer;
