import React, { CSSProperties, ForwardedRef, MutableRefObject, useEffect, useRef, useState } from "react";
import style from "./style.module.scss";
import classnames from "classnames";
import { rectRect } from "utils/collisions";
import { explosion } from "utils";
import store from "store";
import { setGameState } from "actions";
import { GAME_STATE_END } from "reducers";
import ReactGA from "react-ga";

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
    destroyed: boolean;
}

const TURN_LEFT = -1;
const TURN_RIGHT = 1;
const TURN_NEUTRAL = 0;

const TURN_FACTOR = 5;
const THRUST_FACTOR = .2;

const COLLISION_BUMP = .20;

const LASER_TIME = 20;
const LASER_CHARGE_TIME = 0;

const Ship = React.forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => {
    
    const initial: ShipState = {
        azimut: 0,
        vY: 0,
        vX: 0,
        top: document.body.clientHeight / 2,
        left: document.body.clientWidth / 2,
        thrust: false,
        turn: 0,
        laser: false,
        laserTime: LASER_TIME,
        laserRecharge: 0,
        destroyed: false,
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
            checkDestroyed();
        }

        setShipState(previous => ({...shipState}));
        animationRef.current = requestAnimationFrame(updatePosition);
    }
    
    // Check if ship is destroyed and end game.
    const checkDestroyed = ():void => {
        if (shipState.destroyed === false) {
            if (checkIfImpact(shipRef.current)) {
                setShipState((previous) => {
                    previous.destroyed = true;
                    return previous;
                });
                explosion(shipState.left, shipState.top, 1500);
                setTimeout(() => {
                    store.dispatch(setGameState(GAME_STATE_END));
                    ReactGA.event({
                        category: 'Game',
                        action: 'Game End',
                        label: 'Score',
                        value: store.getState().score,
                    });
                }, 2100);
            }
        }
    }

    // Check collision with enemies.
    const checkIfImpact = (shipRef: any): boolean => {
        const enemies = document.getElementById("enemies")?.getElementsByTagName('div');
        
        if (enemies && shipRef) {
            const rect1 = shipRef.getBoundingClientRect();
            const list = Array.from(enemies);

            for (let x = 0; x < list.length; x++) {
                const rect2 = list[x].getBoundingClientRect();

                const hit = rectRect(
                    rect1.left, rect1.top, rect1.width, rect1.height,
                    rect2.left, rect2.top, rect2.width, rect2.height
                    );
                if (hit) return true;
            }
        }

        return false;
    };

    // Check collision with screen borders.
    const checkCollision = () => {
        if (shipState.left < 0) {
            shipState.vX = collision(shipState.vX);
            shipState.left = 0;
        }
        if (shipState.left > screenRef.offsetWidth - 40) {
            shipState.vX = collision(shipState.vX);
            shipState.left = screenRef.offsetWidth - 40;
        }
        if (shipState.top < 0) {
            shipState.vY = collision(shipState.vY);
            shipState.top = 0;
        }
        if (shipState.top > screenRef.offsetHeight - 40) {
            shipState.vY = collision(shipState.vY);
            shipState.top = screenRef.offsetHeight - 40;
        }
    }

    // Reduce speed when colliding with screen borders.
    const collision = (number: number): number => {
        return number * -1 * COLLISION_BUMP;
    }

    // Thrust!
    const engageThruster = (power: boolean): void => {
        if (shipState.thrust !== power) {
            setShipState((previous) => {
                previous.thrust = power;
                return previous;
            });
        }
    }

    // Fire!
    const fire = (): void => {
        if (!shipState.laser && shipState.laserRecharge === 0 && shipState.destroyed === false) {
            setShipState((previous) => {
                previous.laser = true;
                return previous;
            });
        }
    }

    // Turn
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
        visibility: shipState.destroyed ? "hidden" : "visible",
    } as CSSProperties;

    return (
        <div className={style.shipContainer}>
            <div id="player1" ref={shipRef} className={style.ship} style={shipStyle} data-testid="player1">
                <div className={classnames(style.thrust, shipState.thrust ? style.visible : null)} >
                    <div className={style.flameWrapper}>
                        <div className={classnames(style.flame, style.red)}></div>
                        <div className={classnames(style.flame, style.orange)}></div>
                        <div className={classnames(style.flame, style.gold)}></div>
                        <div className={classnames(style.flame, style.white)}></div>
                    </div>
                </div>
                <div id="laser" className={classnames(style.laser, shipState.laser ? style.on : null)} />
            </div>
        </div>
    )
});

export default Ship;
