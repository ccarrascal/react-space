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
    const initial: ShipState = {
        azimut: 0,
        vY: 0,
        vX: 0,
        top: 400,
        left: 400,
    }

    const [shipState, setShipState] = useState(initial);


    


    useEffect(() => {

    const updatePosition = (): void => {
        shipState.top += (shipState.vY * -1) / 60;
        shipState.left += shipState.vX / 60;
        setShipState({...shipState});
        // console.log("Shipstate position " , shipState);
        // window.requestAnimationFrame(updatePosition);
    }

        const shipKeyboardControl = (event: KeyboardEvent) => {

            // console.log("Key [" + event.key + " keycode [" + event.keyCode + "]");
            switch (event.key) {
                case "ArrowRight":
                    shipState.azimut += 10;
                    setShipState({...shipState});
                break;

                case "ArrowLeft":
                    shipState.azimut -= 10;
                    setShipState({...shipState});
                break;

                case "ArrowUp":
                    const degrees = (shipState.azimut % 360) * -1;
                    const radians = degrees * (Math.PI / 180);
                    const x = parseFloat((Math.cos(radians) * 5).toFixed(3));
                    const y = parseFloat((Math.sin(radians) * 5).toFixed(3));
                    console.log("degrees ", degrees);
                    console.log("radians ", radians);
                    console.log("X ", x);
                    console.log("Y ", y);

                    shipState.vX += x;
                    shipState.vY += y;
                    setShipState({...shipState});
                break;
            }

            // shipState.azimut = shipState.azimut % 360;
            console.log("Shipstate Effect " , shipState);

            updatePosition();
        };

        document.addEventListener("keydown", shipKeyboardControl);

        return (): void => {
            // Unbind the event listener on clean up
            document.removeEventListener("keydown", shipKeyboardControl);
        };
    }, [shipState]);

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
