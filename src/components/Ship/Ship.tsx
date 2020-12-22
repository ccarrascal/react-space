import { MutableRefObject, useEffect, useRef, useState } from "react";
import style from "./style.module.scss";

interface ShipState {
    azimut: number;
    aX: number;
    aY: number;
    style?: {
        transform: string;
    }
}

const Ship = (): JSX.Element => {
    
    const shipRef: MutableRefObject<null> = useRef(null);
    const initial: ShipState = {
        azimut: 0,
        aY: 0,
        aX: 0,
    }

    const [shipState, setShipState] = useState(initial);

    useEffect(() => {


        const shipKeyboardControl = (event: KeyboardEvent) => {

            console.log("Key [" + event.key + " keycode [" + event.keyCode + "]");
            switch (event.key) {
                case "ArrowRight":
                    shipState.azimut += 10;
                break;

                case "ArrowLeft":
                    shipState.azimut -= 10;
                break;
            }
            console.log("Shipstate " , shipState);
            setShipState({...shipState});

        };

        document.addEventListener("keydown", shipKeyboardControl);

        return (): void => {
            // Unbind the event listener on clean up
            document.removeEventListener("keydown", shipKeyboardControl);
        };
    });

    var shipStyle = {
        transform: "rotate(" + shipState.azimut + "deg)",
    };

    return (
        <div>

            <div ref={shipRef} className={style.ship} style={shipStyle}>
                <div className={style.status}>Azimut: {shipState.azimut}</div>
            </div>
        </div>
    )
}

export default Ship;
