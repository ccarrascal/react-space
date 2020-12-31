import { setBackground } from "actions";
import { Enemies } from "components/Enemies";
import { Ship } from "components/Ship";
import React, { useEffect } from "react";
import store from "store";
import style from "./style.module.scss";

const STAR_COUNT = 6000;

interface Props {
    children: JSX.Element | JSX.Element[];
}

const drawStars = (total: number, canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const context = canvas && canvas.getContext("2d");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    if (context) {
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
    }
}

const Screen = (props: Props) => {
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

    return (
        <div ref={shipRef} className={style.screen} id="Screen">
            <canvas id={"canvas"} ref={canvasRef} className={style.background} />
            <Ship ref={shipRef} />
            <Enemies />
        </div>
    )
}

export default Screen;
