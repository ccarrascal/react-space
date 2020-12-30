import { ADD_SCORE } from "actions";

const initialState = {
  score: 0,
  background: null,
};

function rootReducer(state = initialState, action: any) {
    switch (action.type) {
        case ADD_SCORE:
            state.score++;
            state = {...state};
        break;
    }
  return state;
};

export default rootReducer;
