import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import logger from './middleware/logger';

const store = createStore(rootReducer, compose(applyMiddleware(thunk, logger)));

export default store;
