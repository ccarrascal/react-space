
import React from "react";
import style from "./style.module.scss";

const Header = (): JSX.Element => {
    return (
        <header className={style.header}>
            <h1 className={style.title}>Ascii space</h1>
        </header>
    )
}

export default Header;
