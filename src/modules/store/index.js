import {initialState} from './initialState.js';
import {createRootReducer} from '../chat/reducers';
import {createStore} from 'redux';

export const configureStore = () => {
  return createStore(createRootReducer(), initialState);
};