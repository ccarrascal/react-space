import { connect } from "react-redux";
import style from "./style.module.scss";

const mapStateToProps = (state: any): any => {
  return { score: state.score };
};

const ConnectedScore = ({score}: any) => {
    return (
        <div className={style.score}>
            <div className={style.title}>Score:</div>
            <div className={style.data}>{score}</div>
        </div>
    )
}

const Score = connect(mapStateToProps)(ConnectedScore);

export default Score;
