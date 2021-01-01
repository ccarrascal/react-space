import { Asteroid } from "components/Asteroid";
import React from "react";
import style from "./style.module.scss";
import { connect } from "react-redux";

const mapStateToProps = (state: any): any => {
  return { score: state.score };
};

const ConnectedEnemies = ({score}: any): JSX.Element => {

    return (
        <div className={style.enemies}>
            <Asteroid />
        </div>
    )
}
const Enemies = connect(mapStateToProps)(ConnectedEnemies);


export default Enemies;
