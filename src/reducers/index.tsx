import { ADD_SCORE, SET_ASTEROID, SET_BACKGROUND, SET_GAME_STATE, SET_PARTICLES } from "actions";
import { AsteroidState } from "components/Asteroid/Asteroid";

export const GAME_STATE_READY = 0;
export const GAME_STATE_GAME = 1;
export const GAME_STATE_END = 2;

interface AppState {
    gameState: number;
    score: number;
    background: ImageData | null; // Original background to use in animation frames.
    particles: any[];  // Explosions particles.
    asteroids: AsteroidState[]; // Asteroids state.
}

const initialState: AppState = {
    gameState: GAME_STATE_READY,
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
        case SET_GAME_STATE:
            state.gameState = action.state;
            state = {...state};
        break;
    }
    return state;
};

export default rootReducer;
