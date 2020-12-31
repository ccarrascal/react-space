export const ADD_SCORE = "ADD_SCORE";
export const SET_BACKGROUND = "SET_BACKGROUND";
export const SET_PARTICLES = "SET_PARTICLES";

export function addScore() {
    return { type: ADD_SCORE }
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