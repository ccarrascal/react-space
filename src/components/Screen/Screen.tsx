import { Asteroid } from "components/Asteroid";
import { Ship } from "components/Ship";
import React, { useEffect } from "react";
import style from "./style.module.scss";

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
    }
}

const Screen = (props: Props) => {
    const shipRef = React.createRef<HTMLDivElement>();
    const canvasRef = React.createRef<HTMLCanvasElement>();

    useEffect(() => {
        const resizeWindow = () => {
            drawStars(6000, canvasRef.current);
        }

        resizeWindow();
        window.addEventListener("resize", resizeWindow);
        return () => window.removeEventListener("resize", resizeWindow);

    }, [canvasRef]);

    return (
        <div ref={shipRef} className={style.screen} id="Screen">
            <canvas id={"canvas"} ref={canvasRef} className={style.background} />
            <Ship ref={shipRef} />
            <div className={style.enemies}>
                <Asteroid />
            </div>
        </div>
    )
}

export default Screen;
