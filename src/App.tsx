import "./App.css";
import Main from "./components/main";
import TitleMenu from "./components/title-menu";
import { useStore } from "./hooks/store";

function App() {
  const gameStarted = useStore((state) => state.gameStarted);
  return (
    <>
      <div className="bg-gray-950">
        {!gameStarted ? <Main /> : <TitleMenu />}
      </div>
    </>
  );
}

export default App;
