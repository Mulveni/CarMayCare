import navButtonsReducer from './navButtonsReducer';
import loginReducer from './loginReducer';

import { combineReducers } from 'redux';

const allReducers = combineReducers({
    navButtonsReducer,
    loginReducer
});

export default allReducers;