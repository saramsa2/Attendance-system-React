import logo from './logo.svg';
import './App.css';
import {Routes, Route} from "react-router-dom";
import Home from "./components/Home";
import Semester from "./components/Semester";
import Navigation from "./components/Navigation";

function App() {
  return (
    <div className="App">
        <Navigation />
      <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path="Semester" element={ <Semester/> } />
        {/*<Route path="contact" element={ <Contact/> } />*/}
      </Routes>
    </div>
  );
}

export default App;
