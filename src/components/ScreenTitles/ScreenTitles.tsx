import { resetScore, setGameState } from "actions";
import classnames from "classnames";
import { useEffect, useState } from "react";
import { GAME_STATE_GAME, GAME_STATE_READY } from "reducers";
import style from "./style.module.scss";
import store from "store";

const ScreenTitles = ({...props}: any): JSX.Element => {

    const [start, setStart] = useState(false);
    const title = props?.end ? "GAME OVER" : "Player 1 Get Ready";
    const message = props?.end ? "Press SPACE key" : "Press SPACE key to start";

    const keyboardListener = (event: KeyboardEvent) => {
        if (!start && event.key === " ") {
            setStart(true);
            const newState = props?.end ? GAME_STATE_READY : GAME_STATE_GAME;
            setTimeout(() => {
                store.dispatch(setGameState(newState));
                if (newState === GAME_STATE_READY) store.dispatch(resetScore()); 
            }, 1100);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", keyboardListener);

        return (): void => {
            // Unbind the event listener on clean up
            document.removeEventListener("keydown", keyboardListener);
        };
    });

    return (
        <div className={classnames(style.screenTitles, start ? style.hidden : style.visible)}>
            <div className={style.titles}>
                <h2 className={style.glitch} data-text={title}>{title}</h2>
                <h3 className={style.glitch} data-text={message}>{message}</h3>
            </div>
            {!props?.end && (
                <div className={style.controls}>
                    <div className={style.key}>&#8592;</div>
                    <div className={style.key}>&#8593;</div>
                    <div className={style.key}>&#8594;</div>
                    <div className={classnames(style.key, style.space)}>SPACE</div>
                </div>
            )}
            <div className={style.credits}>
                <a rel="noreferrer" target="_blank" href="https://github.com/ccarrascal/react-space">
                    Credits & Github repo
                </a>
            </div>
            <div className={style.version}>v{process.env.REACT_APP_VERSION}</div>
        </div>
    )
}

export default ScreenTitles;
