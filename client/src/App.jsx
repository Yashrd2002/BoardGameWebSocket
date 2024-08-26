import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/:room" element={<Game/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
