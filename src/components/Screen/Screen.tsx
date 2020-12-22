
import React from "react";
import style from "./style.module.scss";

interface Props {
    children: JSX.Element | JSX.Element[];
}

const Screen = (props: Props): JSX.Element => {
    return (
        <div className={style.screen}>
            {props.children}
        </div>
    )
}

export default Screen;
