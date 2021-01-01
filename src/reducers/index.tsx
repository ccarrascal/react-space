import { ADD_SCORE, SET_ASTEROID, SET_BACKGROUND, SET_PARTICLES } from "actions";
import { AsteroidState } from "components/Asteroid/Asteroid";

interface AppState {
    score: number;
    background: ImageData | null; // Original background to use in animation frames.
    particles: any[];  // Explosions particles.
    asteroids: AsteroidState[]; // Asteroids state.
}

const initialState: AppState = {
    score: 0,
    background: null,
    particles: [],
    asteroids: [],
};

function rootReducer(state = initialState, action: any) {
    switch (action.type) {
        case ADD_SCORE:
            state.score++;
            state = {...state};
        break;
        case SET_BACKGROUND:
            state.background = action.background;
            state = {...state};
        break;
        case SET_PARTICLES:
            state.particles = action.particles;
            state = {...state};
        break;
        case SET_ASTEROID:
            state.asteroids[action.index] = {...action.asteroid};
        break;
    }
    return state;
};

export default rootReducer;
