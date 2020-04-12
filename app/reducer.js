/* action-type */
export const SHOULD_UPDATE = "SHOULD_UPDATE"
export const LOGIN_SUCCESS = "LOGIN_SUCCESS"

const initialState = {
  prevShouldUpdate: null,
  shouldUpdate: false,
  logged: false,
  userInfo: {
    user: null,
    token: null
  }
};

/* reducer */
function rootReducer(state = initialState, action) {
  if (action.type === SHOULD_UPDATE) {
    return { 
      ...state,
      prevShouldUpdate: state.shouldUpdate,
      shouldUpdate: action.payload
    }
  }
  else if(action.type === LOGIN_SUCCESS) {
    return {
      ...state,
      logged: true,
      userInfo: {
        user: action.payload.user,
        token: action.payload.token 
      }
    }
  }
  return state
}

/* action-creator */
export function update(payload) {
  return { type: SHOULD_UPDATE, payload };
}

export function login(payload) {
  return { type: LOGIN_SUCCESS, payload };
}

export default rootReducer;