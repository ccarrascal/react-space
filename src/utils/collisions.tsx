// Collision detection functions.
// Taken from http://www.jeffreythompson.org/collision-detection/line-rect.php

// Line and rectangle
export const lineRect = (x1: number, y1: number, x2: number, y2: number, rx: number, ry: number, rw: number, rh: number): boolean => {

    // check if the line has hit any of the rectangle's sides
    // uses the Line/Line function below
    const left =   lineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh);
    const right =  lineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh);
    const top =    lineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry);
    const bottom = lineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);

    // if ANY of the above are true, the line
    // has hit the rectangle
    if (left || right || top || bottom) {
        return true;
    }
    return false;
}

// Line and line
export const lineLine = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number): boolean => {
    // calculate the direction of the lines
    const uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
    const uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        return true;
    } 

    return false;
};

// Rectangle and rectange
export const rectRect = (r1x: number, r1y: number, r1w: number, r1h: number, r2x: number, r2y: number, r2w: number, r2h: number): boolean => {

    // are the sides of one rectangle touching the other?
    if (r1x + r1w >= r2x &&    // r1 right edge past r2 left
        r1x <= r2x + r2w &&    // r1 left edge past r2 right
        r1y + r1h >= r2y &&    // r1 top edge past r2 bottom
        r1y <= r2y + r2h) {    // r1 bottom edge past r2 top
            return true;
    }
    return false;
}
