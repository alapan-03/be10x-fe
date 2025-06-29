import logo from './logo.svg';
import './App.css';
import Hero from './Components/Hero/Hero.js';
import Navbar from './Components/Navbar/Navbar.js';
import MutualFund from './Components/MF-Home/MutualFund.js';
import {BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './Components/Auth/AuthPage.js';
import Home from './Pages/Home.js';
import Saved from './Components/Saved/Saved.js';
import Footer from './Components/Footer/Footer.js';
import Signup from './Components/Auth/Signup.js';

function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="*" element={<h2 className='centered'>404 Page Not Found</h2>} /> 
      </Routes>
      </BrowserRouter>
      <Footer/>
    </div>
  );
}

export default App;
