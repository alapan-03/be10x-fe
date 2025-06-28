import logo from './logo.svg';
import './App.css';
import Hero from './Components/Hero/Hero.js';
import Navbar from './Components/Navbar/Navbar.js';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Hero/>
    </div>
  );
}

export default App;
