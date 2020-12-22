
import React from "react";
import style from "./style.module.scss";

const Header = (): JSX.Element => {
    return (
        <header className={style.header}>
            <div className={style.logo}>ASCII Space</div>
        </header>
    )
}

export default Header;
