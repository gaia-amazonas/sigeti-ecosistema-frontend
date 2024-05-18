// src/App.tsx
import React from 'react';
import './App.css';
import SexoyEdadList from './components/indicadores/territoriales/piramides/SexoyEdad';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>SIGETI</h1>
      </header>
      <main>
        <SexoyEdadList />
      </main>
    </div>
  );
};

export default App;
