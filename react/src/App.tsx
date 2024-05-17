// src/App.tsx
import React from 'react';
import './App.css';
import ActorList from './components/ActorsList';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to My React App</h1>
      </header>
      <main>
        <ActorList />
      </main>
    </div>
  );
};

export default App;
