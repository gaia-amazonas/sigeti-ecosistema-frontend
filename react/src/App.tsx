// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Indicadores from './components/indicadores/Indicadores';
import SexoyEdad from './components/indicadores/territoriales/piramides/SexoyEdad';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>SIGETI</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/indicadores" element={<Indicadores />} />
            <Route path="/indicadores/piramide_poblacional/:id" element={<SexoyEdad />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const Home: React.FC = () => (
  <div className="indicadores-container">
    <h2>Grupo SIGETI ~ Gaia Amazonas</h2>
    <p>Alguna información básica sobre el grupo SIGETI de Gaia Amazonas</p>
    <Link to="/indicadores" className="indicadores-link">¡Ir a Indicadores!</Link>
  </div>
);

export default App;
