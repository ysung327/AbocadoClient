  /* action-type */
  export const SHOULD_UPDATE = "SHOULD_UPDATE"
  export const LOGIN_SUCCESS = "LOGIN_SUCCESS"
  export const GET_DUTY = "GET_DUTY"

  const initialState = {
    prevShouldUpdate: null,
    shouldUpdate: false,
    logged: false,
    userInfo: {
      user: null,
      token: null
    },
    duty: {
      end_date: null,
      lefted: null,
      percent: null,
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
    else if(action.type === GET_DUTY) {
      return {
        ...state,
        duty: {
          end_date: action.payload.end_date,
          lefted: action.payload.lefted,
          percent: action.payload.percent, 
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

  export function getDuty(payload) {
    return { type: GET_DUTY, payload };
  }

  export default rootReducer;