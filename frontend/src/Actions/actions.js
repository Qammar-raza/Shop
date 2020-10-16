import * as actionType from "./actionType";

// USER ACTIONS

export const setUserId = (userID, token) => {
  return {
    type: actionType.CURRENT_USER_ID,
    payload: {
      currentUserID: userID,
      token: token,
    },
  };
};

export const clearUserId = () => {
  return {
    type: actionType.CLEAR_USER_ID,
  };
};
