import { MutableRefObject, useEffect, useRef, useState } from "react";
import style from "./style.module.scss";

interface ShipState {
    azimut: number;
    vX: number;
    vY: number;
    top: number;
    left: number;
}

const Ship = (): JSX.Element => {
    
    const shipRef: MutableRefObject<null> = useRef(null);
    const animationRef: MutableRefObject<number|undefined> = useRef();

    const initial: ShipState = {
        azimut: 0,
        vY: 0,
        vX: 0,
        top: 400,
        left: 400,
    }

    const [shipState, setShipState] = useState(initial);


    const updatePosition = (): void => {
        shipState.top += (shipState.vY * -1) / 60;
        shipState.left += shipState.vX / 60;
        setShipState(previous => ({...shipState}));
        animationRef.current = requestAnimationFrame(updatePosition);
    }
    


    useEffect(() => {

        const shipKeyboardControl = (event: KeyboardEvent) => {

            switch (event.key) {
                case "ArrowRight":
                    setShipState(previous => {
                        previous.azimut += 10;
                        return previous;
                    });
                break;

                case "ArrowLeft":
                    setShipState((previous) => {
                        previous.azimut -= 10;
                        return previous;
                    });

                break;

                case "ArrowUp":
                    setShipState((previous) => {
                        const degrees = (previous.azimut % 360) * -1;
                        const radians = degrees * (Math.PI / 180);
                        previous.vX += parseFloat((Math.cos(radians) * 5).toFixed(3));
                        previous.vY += parseFloat((Math.sin(radians) * 5).toFixed(3));

                        return previous;
                    });
                break;
            }

        };

        animationRef.current = requestAnimationFrame(updatePosition);

        document.addEventListener("keydown", shipKeyboardControl);

        return (): void => {
            // Unbind the event listener on clean up
            document.removeEventListener("keydown", shipKeyboardControl);
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
