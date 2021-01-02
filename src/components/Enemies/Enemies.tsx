import { Asteroid } from "components/Asteroid";
import React from "react";
import style from "./style.module.scss";
import { connect } from "react-redux";

const mapStateToProps = (state: any): any => {
  return { score: state.score };
};

const ConnectedEnemies = ({score}: any): JSX.Element => {

    return (
        <div id={"enemies"} className={style.enemies}>
            <Asteroid index={0} />
            {score >= 5  && (<Asteroid index={1} />)}
            {score >= 10 && (<Asteroid index={2} />)}
            {score >= 15 && (<Asteroid index={3} />)}
            {score >= 20 && (<Asteroid index={4} />)}
        </div>
    )
}
const Enemies = connect(mapStateToProps)(ConnectedEnemies);

export default Enemies;
