/* action-type */
export const SHOULD_UPDATE = "SHOULD_UPDATE"

const initialState = {
  shouldUpdate: false
};

/* reducer */
function rootReducer(state = initialState, action) {
  if (action.type === SHOULD_UPDATE) {
    return { ...state, shouldUpdate: action.payload }
	}
  return state
}

/* action-creator */
export function update(payload) {
  return { type: SHOULD_UPDATE, payload };
}

export default rootReducer;