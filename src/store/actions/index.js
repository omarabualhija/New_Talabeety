import { Alert } from 'react-native';
import {
  SAVE_USER,
  LOGOUT,
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
  GET_CART_USER
} from './types';

export const saveUser = user => {
  return {
    type: SAVE_USER,
    payload: user,
  };
};

export const saveCity = city => {
  return {
    type: SAVE_CITY,
    payload: city,
  };
};

export const saveCities = cities => {
  return {
    type: SAVE_CITIES,
    payload: cities,
  };
};

export const addToCart = item => {
  return {
    type: ADD_TO_CART,
    payload: item,
  };
};

export const onItemPlus = id => {
  return {
    type: ON_ITEM_PLUS,
    payload: id,
  };
};
export const onItemInput = (id ,number )=> {
  return {
    type: ON_ITEM_PLUS,
    payload: id,
    number:number,
  };
};
export const onItemMinus = id => {
  return {
    type: ON_ITEM_MINUS,
    payload: id,
  };
};

export const onItemRemove = id => {
  return {
    type: ON_ITEM_REMOVE,
    payload: id,
  };
};

export const clearCart = () => {
  return {
    type: CLEAR_CART,
  };
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

export const cartItemNote = payload => {
  return {
    type: ITEM_NOTE,
    payload,
  };
};

export const showNotifications = data => {
  return {
    type: SHOW_NOTIFICATION,
    payload: data,
  };
};

export const cartItemCheck = payload => {
  return {
    type: CART_ITEM_CHECK,
    payload,
  };
};
export const getCartItem = payload => {
  
  return {
    type: GET_CART_USER,
    payload,
  };
};
