import './App.css';
import { Header } from "./components/Header";
import { Screen} from "./components/Screen";
import ReactGA from 'react-ga';


function App() {

    // Check for Google Analytics code and init.
    if (process.env.REACT_APP_GA) {
        ReactGA.initialize(process.env.REACT_APP_GA);
        ReactGA.pageview(window.location.pathname + window.location.search);
    }

    return (
        <div className="App">
        <Header />
        <Screen />
        </div>
    );
}

export default App;
