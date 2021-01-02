import { AsteroidState } from "components/Asteroid/Asteroid";

export const ADD_SCORE = "ADD_SCORE";
export const RESET_SCORE = "RESET_SCORE";
export const SET_BACKGROUND = "SET_BACKGROUND";
export const SET_PARTICLES = "SET_PARTICLES";
export const SET_ASTEROID = "SET_ASTEROID";
export const SET_GAME_STATE = "SET_GAME_STATE";

export function addScore() {
    return { type: ADD_SCORE }
};

export function resetScore() {
    return { type: RESET_SCORE }
};

export const setBackground = (canvas: HTMLCanvasElement | null) => {
    let background = null;
    if (canvas) {
        const context = canvas && canvas.getContext("2d");
        background = context && context.getImageData(0, 0, canvas.width, canvas.height);
    }
    return { type: SET_BACKGROUND, background }
}

export const setParticles = (particles: any[]) => {
    return { type: SET_PARTICLES, particles }
}

export const setAsteroid = (asteroid: AsteroidState, index: number) => {
    return { type: SET_ASTEROID, asteroid, index };
}

export const setGameState = (state: any) => {
    return { type: SET_GAME_STATE, state };
}
