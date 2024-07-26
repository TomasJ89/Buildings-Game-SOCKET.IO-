import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GamePage from "./pages/GamePage";
import LoginPage from "./pages/LoginPage";
const { socket } = require('./plugins/sockets');

function App() {

    return (
        <div className="p-5 d-flex justify-content-center">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LoginPage socket={socket} />} />
                    <Route path="/game" element={<GamePage socket={socket} />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
