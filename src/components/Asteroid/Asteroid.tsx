import { addScore, setAsteroid } from "actions";
import { CSSProperties, MutableRefObject, useEffect, useRef, useCallback } from "react";
import store from "store";
import { explosion, lineRect } from "utils";
import style from "./style.module.scss";
import { useSelector} from "react-redux";

export interface AsteroidState {
    vX: number;
    vY: number;
    top: number;
    left: number;
    destroyed: boolean;
    azimut: number;
}

const ORIGIN_TOP = 1;
const ORIGIN_RIGHT = 2;
const ORIGIN_BOTTOM = 3;
const ORIGIN_LEFT = 4;

const SPEED = 2;

const Asteroid = ({index}: any): JSX.Element => {

    const initialAsteroidState: AsteroidState | null = {
        vX: 0,
        vY: 0,
        top: 0,
        left: 0,
        destroyed: false,
        azimut: 0,
    };

    const restartPosition = () => {

        const getSpeed = (): number => {
            const factor = store.getState().score / 8;
            return factor + SPEED;
        }

        const setDirection = (left: number | null, top: number | null, degrees: number): AsteroidState => {
            const radians = degrees * (Math.PI / 180);
            const newState: AsteroidState = {
                left: left !== null ? left : Math.floor(Math.random() * document.body.clientWidth),
                top: top !== null ? top : Math.floor(Math.random() * document.body.clientHeight),
                vX: parseFloat((Math.cos(radians) * getSpeed()).toFixed(3)),
                vY: parseFloat((Math.sin(radians) * getSpeed()).toFixed(3)),
                destroyed: false,
                azimut: 0,
            };

            return newState;
        }

        let newState: AsteroidState = {...initialAsteroidState};
        let degrees = 0;
        const origin = Math.ceil(Math.random() * 4);

        switch (origin) {
            case ORIGIN_TOP:
                degrees = Math.random() * 180;
                newState = setDirection(null, 0, degrees);
                break;
            case ORIGIN_RIGHT:
                degrees = Math.random() * 180 + 90;
                newState = setDirection(document.body.clientWidth, null, degrees);
                break;
            case ORIGIN_BOTTOM:
                degrees = Math.random() * 180 + 180;
                newState = setDirection(null, document.body.clientHeight, degrees);
                break;
            case ORIGIN_LEFT:
                degrees = Math.random() * 180 - 90;
                newState = setDirection(0, null, degrees);
                break;
        }
        return newState;
    }

    const checkIfBlasted = (asteroidRef: any): boolean => {

        const laser = document.getElementById("laser");
        const ship = document.getElementById("player1");

        let hit = false;

        if (ship && laser && laser.className.includes("style_on")) {
            const search = ship.style.transform.match(/.*rotate\((.*)deg\)/);
            let azimut = search && search[1] ? parseInt(search[1]) % 360 : 0;
            azimut = azimut < 0 ?  azimut + 360 : azimut;

            const rect1 = laser.getBoundingClientRect();
            const rect2 = asteroidRef.getBoundingClientRect();

            if ((azimut >= 0 && azimut <= 90) || (azimut >= 180 && azimut <= 270)) {
                hit = lineRect(rect1.left, rect1.top, rect1.right, rect1.bottom, rect2.left, rect2.top, rect2.width, rect2.height);
            } else {
                hit = lineRect(rect1.left, rect1.bottom, rect1.right, rect1.top, rect2.left, rect2.top, rect2.width, rect2.height);
            }

        }
        return hit;
    };

    const animate = useCallback(() => {

        if (asteroid.top <= 0 || asteroid.top >= document.body.clientHeight || asteroid.left <= 0 || asteroid.left >= document.body.clientWidth) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            asteroid = restartPosition();
        }

        asteroid.top += asteroid.vY;
        asteroid.left += asteroid.vX;
        asteroid.azimut += 1;

        if (asteroid.destroyed === false) {
            if (checkIfBlasted(asteroidRef.current)) {
                explosion(asteroid.left, asteroid.top);
                store.dispatch(addScore());
                asteroid.destroyed = true;
                asteroid = restartPosition();
            }
        }

        store.dispatch(setAsteroid(asteroid, index));
        animationRef.current = requestAnimationFrame(animate);
    }, []);

    var asteroid = useSelector((state: { asteroids: any; }): any => state.asteroids[index]);
    asteroid = !asteroid ? initialAsteroidState : asteroid;
    const animationRef: MutableRefObject<number|undefined> = useRef();
    const asteroidRef: MutableRefObject<null> = useRef(null);

    useEffect(() => {

        animationRef.current = requestAnimationFrame(animate);
        return (): void => {
            // Unbind the event listener on clean up
            cancelAnimationFrame(animationRef.current as number);
        };
    }, [asteroid, animate]);

    const asteroidStyle = {
        top: asteroid.top,
        left: asteroid.left,
        visibility: asteroid.destroyed ? "hidden" : "visible",
        transform: "rotate(" + asteroid.azimut + "deg)",
    } as CSSProperties;

    return (
        <div ref={asteroidRef} className={style.asteroid} style={asteroidStyle} />
    )
}

export default Asteroid;
