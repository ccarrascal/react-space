import { Ship } from "components/Ship";
import React from "react";
import style from "./style.module.scss";

interface Props {
    children: JSX.Element | JSX.Element[];
}

const Screen = (props: Props): JSX.Element => {
    const ref = React.createRef<HTMLDivElement>();
    return (
        <div ref={ref} className={style.screen}>
            <Ship ref={ref} />
        </div>
    )
}

export default Screen;
