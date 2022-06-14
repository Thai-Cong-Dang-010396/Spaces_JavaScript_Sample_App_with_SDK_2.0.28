import { combineReducers } from 'redux';
import { appReducer } from './app/reducer';

export default combineReducers({ data: appReducer });
