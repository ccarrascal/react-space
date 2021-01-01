import { setBackground } from "actions";
import { Enemies } from "components/Enemies";
import { Ship } from "components/Ship";
import React, { useEffect } from "react";
import store from "store";
import style from "./style.module.scss";
import { connect } from "react-redux";
import { GAME_STATE_GAME, GAME_STATE_READY } from "reducers";
import { ScreenReady } from "components/ScreenReady";

const STAR_COUNT = 6000;

const drawStars = (total: number, canvas: HTMLCanvasElement | null) => {
    const context = canvas && canvas.getContext("2d");
    const background = store.getState().background;

    if (!canvas || !context) return;

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    if (background === null) {
        for (let x=0; x <= total; x++) {
            const star = {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
            }
            const intensity = Math.random() * 255;
            context.fillStyle = "rgb(" + intensity + "," + intensity + "," + intensity + ")";
            const size = Math.random() > .9? 2: 1;
            context.fillRect(star.x, star.y, size, size);
        }
        store.dispatch(setBackground(canvas));
    } else {
        context.putImageData(background, 0, 0);
    }
}

const mapStateToProps = (state: any): any => {
  return { gameState: state.gameState };
};

const ConnectedScreen = ({gameState}: any) => {
    const shipRef = React.createRef<HTMLDivElement>();
    const canvasRef = React.createRef<HTMLCanvasElement>();

    useEffect(() => {
        const resizeWindow = () => {
            drawStars(STAR_COUNT, canvasRef.current);
        }

        resizeWindow();
        window.addEventListener("resize", resizeWindow);
        return () => window.removeEventListener("resize", resizeWindow);

    }, [canvasRef]);

    let content;
    switch (gameState) {
        case GAME_STATE_READY:
            content = <ScreenReady />
        break;
        case GAME_STATE_GAME:
            content = (
                <div>
                    <Ship ref={shipRef} />
                    <Enemies />
                </div>
            )
        break;
    }

    return (
        <div ref={shipRef} className={style.screen} id="Screen">
            <canvas id={"canvas"} ref={canvasRef} className={style.background} />
            {content}
        </div>
    )
}

const Screen = connect(mapStateToProps)(ConnectedScreen);

export default Screen;
