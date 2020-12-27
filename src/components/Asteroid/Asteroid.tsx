import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import style from "./style.module.scss";

interface AsteroidState {
    vX: number;
    vY: number;
    top: number;
    left: number;
}

const ORIGIN_TOP = 1;
const ORIGIN_RIGHT = 2;
const ORIGIN_BOTTOM = 3;
const ORIGIN_LEFT = 4;

const SPEED = 2;

const Asteroid = (): JSX.Element => {

    const initial: AsteroidState | null = {
        vX: 0,
        vY: 0,
        top: 0,
        left: 0,
    };

    const restartPosition = () => {
        const newState: AsteroidState = {
            vX: 0,
            vY: 0,
            top: 0,
            left: 0,
        };

        newState.top = Math.floor(Math.random() * document.body.clientHeight);
        newState.left = Math.floor(Math.random() * document.body.clientWidth);

        const origin = Math.ceil(Math.random() * 4);

        switch (origin) {
            case ORIGIN_TOP:
                newState.top = 0;
                newState.vY = SPEED;
                break;
            case ORIGIN_RIGHT:
                newState.left = document.body.clientWidth;
                newState.vX = -1 * SPEED;
                break;
            case ORIGIN_BOTTOM:
                newState.top = document.body.clientHeight;
                newState.vY = -1 * SPEED;
                break;
            case ORIGIN_LEFT:
                newState.left = 0;
                newState.vX = 1 * SPEED;
                break;
        }

        return newState;
    }

    const animate = () => {

        if (asteroidState.top <= 0 || asteroidState.top >= document.body.clientHeight || asteroidState.left <= 0 || asteroidState.left >= document.body.clientWidth) {
            const newState = restartPosition();
            setAsteroidState((previous) => {
                previous.left = newState.left;
                previous.top = newState.top;
                previous.vX = newState.vX;
                previous.vY = newState.vY;
                return previous;
            });
        }

        setAsteroidState((previous) => {
            previous.top += previous.vY;
            previous.left += previous.vX;
            return previous;
        });

        setAsteroidState(previous => ({...asteroidState}));
        animationRef.current = requestAnimationFrame(animate);
    }

    const [asteroidState, setAsteroidState] = useState(initial);
    const animationRef: MutableRefObject<number|undefined> = useRef();


    useEffect(() => {

        animationRef.current = requestAnimationFrame(animate);

        return (): void => {
            // Unbind the event listener on clean up
            cancelAnimationFrame(animationRef.current as number);
        };
    });

    const asteroidStyle = {
        top: asteroidState.top,
        left: asteroidState.left,
    }

    return (
        <div className={style.asteroid} style={asteroidStyle} />
    )
}

export default Asteroid;
