import './App.css';
import { Header } from "./components/Header";
import { Screen} from "./components/Screen";
import { Ship } from "./components/Ship";

function App() {
  return (
    <div className="App">
      <Header>
        This is a header
      </Header>
      <Screen>
        <Ship />
      </Screen>
    </div>
  );
}

export default App;
