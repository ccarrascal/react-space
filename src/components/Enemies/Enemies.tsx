
import { Asteroid } from "components/Asteroid";
import React from "react";
import style from "./style.module.scss";


const Enemies = ({state}: any): JSX.Element => {
    return (
        <div className={style.enemies}>
            <Asteroid />
        </div>

    )
}

export default Enemies;
