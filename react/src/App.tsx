// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import SeleccionadorTerritorial from './components/indicadores/territoriales/SeleccionadorTerritorial';
import SeleccionadorComunal from './components/indicadores/comunales/SeleccionadorComunal';
import PiramideSexoyEdadTerritorial from './components/indicadores/territoriales/piramides/SexoyEdad';
import InfraestructuraComunal from './components/indicadores/comunales/con_logos/InfraestructuraComunal';
import LenguasBurbujas from './components/indicadores/lenguas/'

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
            {/* <Route path="/indicadores" element={<IndicadoresTerritoriales />} /> */}
            <Route path="/indicadores/territoriales" element={<SeleccionadorTerritorial />} />
            <Route path="/indicadores/territoriales/piramide_poblacional/:id" element={<PiramideSexoyEdadTerritorial />} />
            <Route path="/indicadores/comunales" element={<SeleccionadorComunal />} />
            <Route path="/indicadores/comunales/infraestructura/:id" element={<InfraestructuraComunal />} />
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
    <Link to="/indicadores/territoriales" className="indicadores-link">¡Ir a Indicadores territoriales!</Link>
    <Link to="/indicadores/comunales" className="indicadores-link">¡Ir a Indicadores comunales!</Link>
  </div>
);

export default App;
