import navButtonsReducer from './navButtonsReducer';
import loginReducer from './loginReducer';
import tokenReducer from './tokenReducer';

import { combineReducers } from 'redux';

const allReducers = combineReducers({
    navButtonsReducer,
    loginReducer,
    tokenReducer
});

export default allReducers;