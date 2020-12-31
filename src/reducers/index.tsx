import { ADD_SCORE, SET_BACKGROUND, SET_PARTICLES } from "actions";

interface AppState {
    score: number;
    background: ImageData | null; // Original background to use in animation frames.
    particles: any[];  // Explosions particles.
}

const initialState: AppState = {
    score: 0,
    background: null,
    particles: [],
};

function rootReducer(state = initialState, action: any) {
    switch (action.type) {
        case ADD_SCORE:
            state.score++;
            state = {...state};
        break;
        case SET_BACKGROUND:
            state.background = action.background;
            state = {...state}
        break;
        case SET_PARTICLES:
            state.particles = action.particles;
            state = {...state}
        break;
    }
    return state;
};

export default rootReducer;
