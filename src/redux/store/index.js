import {initialState} from './initialState';
import {createRootReducer} from '../reducers';
import {createStore} from 'redux';

export const configureStore = () => {
  return createStore(createRootReducer(), initialState);
};