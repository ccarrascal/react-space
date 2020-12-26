import React, { ForwardedRef, MutableRefObject, useEffect, useRef, useState } from "react";
import style from "./style.module.scss";
import classnames from "classnames";

interface ShipState {
    azimut: number;
    vX: number;
    vY: number;
    top: number;
    left: number;
    thrust: boolean;
    turn: number;
    laser: boolean;
    laserTime: number;
    laserRecharge: number;
}

const TURN_LEFT = -1;
const TURN_RIGHT = 1;
const TURN_NEUTRAL = 0;

const TURN_FACTOR = 2;
const THRUST_FACTOR = .2;

const COLLISION_BUMP = .20;

const LASER_TIME = 4;
const LASER_CHARGE_TIME = 60;

const Ship = React.forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => {
    
    const initial: ShipState = {
        azimut: 0,
        vY: 0,
        vX: 0,
        top: 400,
        left: 400,
        thrust: false,
        turn: 0,
        laser: false,
        laserTime: LASER_TIME,
        laserRecharge: 0,
    }

    const screenRef = (ref as MutableRefObject<HTMLDivElement>).current;

    const [shipState, setShipState] = useState(initial);
    const shipRef: MutableRefObject<null> = useRef(null);
    const animationRef: MutableRefObject<number|undefined> = useRef();

    const updatePosition = (): void => {

        if (screenRef !== null) {
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

            if (shipState.laser) {
                setShipState((previous) => {
                    previous.laser = previous.laserTime === 0 ? false : true;
                    if (previous.laserTime === 0) previous.laserRecharge = LASER_CHARGE_TIME;
                    previous.laserTime = previous.laserTime > 0 ? previous.laserTime -1 : LASER_TIME;
                    return previous;
                });
            } else {
                setShipState((previous) => {
                    previous.laserRecharge = previous.laserRecharge > 0 ? previous.laserRecharge -1 : 0;
                    return previous;
                });

            }

            checkCollision();
        }

        setShipState(previous => ({...shipState}));
        animationRef.current = requestAnimationFrame(updatePosition);
    }
    
    const checkCollision = () => {
        if (shipState.left < 0) {
            shipState.vX = collision(shipState.vX);
            shipState.left = 0;
        }
        if (shipState.left > screenRef.offsetWidth) {
            shipState.vX = collision(shipState.vX);
            shipState.left = screenRef.offsetWidth;
        }
        if (shipState.top < 0) {
            shipState.vY = collision(shipState.vY);
            shipState.top = 0;
        }
        if (shipState.top > screenRef.offsetHeight) {
            shipState.vY = collision(shipState.vY);
            shipState.top = screenRef.offsetHeight;
        }
    }

    const collision = (number: number): number => {
        return number * -1 * COLLISION_BUMP;
    }

    const engageThruster = (power: boolean): void => {
        if (shipState.thrust !== power) {
            setShipState((previous) => {
                previous.thrust = power;
                return previous;
            });
        }
    }

    const fire = (): void => {
        if (!shipState.laser && shipState.laserRecharge === 0) {
            setShipState((previous) => {
                previous.laser = true;
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
                case " ":
                    fire();
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
        <div className={style.shipContainer}>
            <div ref={shipRef} className={style.ship} style={shipStyle}>
                <div className={classnames(style.thrust, shipState.thrust ? style.visible : null)} >
                    <div className={style.flameWrapper}>
                        <div className={classnames(style.flame, style.red)}></div>
                        <div className={classnames(style.flame, style.orange)}></div>
                        <div className={classnames(style.flame, style.gold)}></div>
                        <div className={classnames(style.flame, style.white)}></div>
                    </div>
                </div>
                <div className={classnames(style.laser, shipState.laser ? style.on : null)} />
            </div>
        </div>
    )
});

export default Ship;
