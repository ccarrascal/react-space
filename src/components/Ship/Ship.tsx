import { MutableRefObject, useEffect, useRef, useState } from "react";
import style from "./style.module.scss";

interface ShipState {
    azimut: number;
    vX: number;
    vY: number;
    top: number;
    left: number;
    thrust: boolean;
    turn: number;
}

const TURN_LEFT = -1;
const TURN_RIGHT = 1;
const TURN_NEUTRAL = 0;
const TURN_FACTOR = 2;

const THRUST_FACTOR = .2;

const Ship = () => {
    
    const initial: ShipState = {
        azimut: 0,
        vY: 0,
        vX: 0,
        top: 400,
        left: 400,
        thrust: false,
        turn: 0,
    }

    const [shipState, setShipState] = useState(initial);
    const shipRef: MutableRefObject<null> = useRef(null);
    const animationRef: MutableRefObject<number|undefined> = useRef();

    const updatePosition = (): void => {
        shipState.top += (shipState.vY * -1);
        shipState.left += shipState.vX;

        if (shipState.thrust) {
            const degrees = (shipState.azimut % 360) * -1;
            const radians = degrees * (Math.PI / 180);
            shipState.vX += parseFloat((Math.cos(radians) * THRUST_FACTOR).toFixed(3));
            shipState.vY += parseFloat((Math.sin(radians) * THRUST_FACTOR).toFixed(3));
        }

        if (shipState.turn !== 0) {
            setShipState((previous) => {
                previous.azimut += previous.turn * TURN_FACTOR;
                return previous;
            });

        }

        setShipState(previous => ({...shipState}));
        animationRef.current = requestAnimationFrame(updatePosition);
    }
    
    const engageThruster = (power: boolean): void => {
        if (shipState.thrust !== power) {
            setShipState((previous) => {
                previous.thrust = power;
                return previous;
            });
        }
    }

    const turnShip = (direction: number): void => {
        if (shipState.turn !== direction) {
            setShipState((previous) => {
                previous.turn = direction;
                return previous;
            });
        }
    }

    useEffect(() => {

        const shipKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowRight":
                    turnShip(TURN_RIGHT);
                break;
                case "ArrowLeft":
                    turnShip(TURN_LEFT);
                break;
                case "ArrowUp":
                    engageThruster(true);
                break;
            }
        };

        const shipKeyUp = (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowUp":
                    engageThruster(false);
                break;
                case "ArrowRight":
                case "ArrowLeft":
                    turnShip(TURN_NEUTRAL);
                break;
            }
        }

        animationRef.current = requestAnimationFrame(updatePosition);

        document.addEventListener("keydown", shipKeyDown);
        document.addEventListener("keyup", shipKeyUp);

        return (): void => {
            // Unbind the event listener on clean up
            document.removeEventListener("keydown", shipKeyDown);
            document.removeEventListener("keyup", shipKeyUp);
            cancelAnimationFrame(animationRef.current as number);
        };
    });

    var shipStyle = {
        transform: "rotate(" + shipState.azimut + "deg)",
        top: shipState.top,
        left: shipState.left,
    };

    return (
        <div>
            <div ref={shipRef} className={style.ship} style={shipStyle}>
                <div className={style.status}>
                    Azimut: {shipState.azimut}<br/>
                    aX: {shipState.vX}<br/>
                    aY: {shipState.vY}<br/>
                </div>
            </div>
        </div>
    )
}

export default Ship;
