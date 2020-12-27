import React, { CSSProperties, MutableRefObject, useEffect, useRef, useState } from "react";
import { lineRect } from "utils";
import style from "./style.module.scss";

interface AsteroidState {
    vX: number;
    vY: number;
    top: number;
    left: number;
    destroyed: boolean;
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
        destroyed: false,
    };

    const restartPosition = () => {
        const newState: AsteroidState = {
            vX: 0,
            vY: 0,
            top: 0,
            left: 0,
            destroyed: false,
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

    const checkIfBlasted = (el2: any): boolean => {

        const laser = document.getElementById("laser");
        const ship = document.getElementById("player1");

        if (ship && laser && laser.className.includes("style_on")) {
            const search = ship.style.transform.match(/.*rotate\((.*)deg\)/);
            let azimut = search && search[1] ? parseInt(search[1]) % 360 : 0;
            azimut = azimut < 0 ?  azimut + 360 : azimut;

            const rect1 = laser.getBoundingClientRect();
            const rect2 = el2.getBoundingClientRect();

            let hit = false;
            if ((azimut >= 0 && azimut <= 90) || (azimut >= 180 && azimut <= 270)) {
                hit = lineRect(rect1.left, rect1.top, rect1.right, rect1.bottom, rect2.left, rect2.top, rect2.width, rect2.height);
            } else {
                hit = lineRect(rect1.left, rect1.bottom, rect1.right, rect1.top, rect2.left, rect2.top, rect2.width, rect2.height);
            }

            return hit;
        }

        return false;
    };

    const animate = () => {

        if (asteroidState.top <= 0 || asteroidState.top >= document.body.clientHeight || asteroidState.left <= 0 || asteroidState.left >= document.body.clientWidth) {
            const newState = restartPosition();
            setAsteroidState((previous) => {
                previous.left = newState.left;
                previous.top = newState.top;
                previous.vX = newState.vX;
                previous.vY = newState.vY;
                previous.destroyed = newState.destroyed;
                return previous;
            });
        }

        setAsteroidState((previous) => {
            previous.top += previous.vY;
            previous.left += previous.vX;
            return previous;
        });

        if (checkIfBlasted(asteroidRef.current)) {
            setAsteroidState((previous) => {
                previous.destroyed = true;
                return previous;
            });
        }

        setAsteroidState(previous => ({...asteroidState}));
        animationRef.current = requestAnimationFrame(animate);
    }

    const [asteroidState, setAsteroidState] = useState(initial);
    const animationRef: MutableRefObject<number|undefined> = useRef();
    const asteroidRef: MutableRefObject<null> = useRef(null);

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
        visibility: asteroidState.destroyed ? "hidden" : "visible",
    } as CSSProperties;

    return (
        <div ref={asteroidRef} className={style.asteroid} style={asteroidStyle} />
    )
}

export default Asteroid;
