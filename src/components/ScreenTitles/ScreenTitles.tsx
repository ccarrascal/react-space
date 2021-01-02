import { setGameState } from "actions";
import classnames from "classnames";
import { useEffect, useState } from "react";
import { GAME_STATE_GAME, GAME_STATE_READY } from "reducers";
import style from "./style.module.scss";
import store from "store";

const ScreenReady = ({...props}: any): JSX.Element => {

    const [start, setStart] = useState(false);
    const title = props?.end ? "GAME OVER" : "Ready Player One";
    const message = props?.end ? "Press any key" : "Press any key to start";

    const pressAnyKey = () => {
        
        if (!start) {
            setStart(true);
            const newState = props?.end ? GAME_STATE_READY : GAME_STATE_GAME;
            setTimeout(() => {
                store.dispatch(setGameState(newState));
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
            <h2 className={style.glitch} data-text={title}>{title}</h2>
            <h3 className={style.glitch} data-text={message}>{message}</h3>
        </div>
    )
}

export default ScreenReady;
