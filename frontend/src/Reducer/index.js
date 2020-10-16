import * as actionType from "../Actions/actionType";
import { combineReducers } from "redux";

const initialUserState = {
  currentUserID: null,
  isAuth: false,
  token: null,
};

const user_reducer = (state = initialUserState, action) => {
  switch (action.type) {
    case actionType.CURRENT_USER_ID:
      return {
        ...state,
        currentUserID: action.payload.currentUserID,
        isAuth: true,
        token: action.payload.token,
      };
    case actionType.CLEAR_USER_ID:
      return {
        ...state,
        currentUserID: null,
        isAuth: false,
        token: null,
      };
    default:
      return state;
  }
};

const RootReducer = combineReducers({
  user: user_reducer,
});

export default RootReducer;
