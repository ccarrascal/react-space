
import { Score } from "components/Score";
import React from "react";
import style from "./style.module.scss";

const Header = (): JSX.Element => {
    return (
        <header className={style.header}>
            <h1 className={style.title}>react space</h1>
            <Score />
        </header>
    )
}

export default Header;
