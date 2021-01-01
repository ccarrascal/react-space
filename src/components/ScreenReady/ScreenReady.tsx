import { setGameState } from "actions";
import classnames from "classnames";
import { useEffect, useState } from "react";
import { GAME_STATE_GAME } from "reducers";
import style from "./style.module.scss";
import store from "store";

const ScreenReady = (): JSX.Element => {

    const [start, setStart] = useState(false);

    const pressAnyKey = () => {
        
        if (!start) {
            setStart(true);
            setTimeout(() => {
                store.dispatch(setGameState(GAME_STATE_GAME));
            }, 1100);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", pressAnyKey);

        return (): void => {
            // Unbind the event listener on clean up
            document.removeEventListener("keydown", pressAnyKey);
        };

    });

    return (
        <div className={classnames(style.screenReady, start ? style.hidden : style.visible)}>
            <h2 className={style.glitch} data-text="Ready Player One">Ready Player One</h2>
            <h3 className={style.glitch} data-text="Press any key to start">Press any key to start</h3>
        </div>
    )
}

export default ScreenReady;
