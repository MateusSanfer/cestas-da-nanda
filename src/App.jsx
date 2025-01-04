import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import Contato from './pages/Contato';
import Pagamento from './pages/Pagamento';
import Login from './pages/Login';



function App() {
  return (
    
      <Router>
      <Header />
     
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      </Router>
  );
}

export default App;