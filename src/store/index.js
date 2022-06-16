import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import Reducer from './reducers';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Reducers = {
  data: Reducer,
};

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers(Reducers),
);

const Store = createStore(persistedReducer, applyMiddleware(thunk));
export const persistor = persistStore(Store);

export default Store;
