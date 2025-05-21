import React from 'react';
import './App.css';
import PhaserGameComponent from './components/PhaserGameComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Simple Phaser 3 Platformer</h1>
        <p>Use arrow keys to move and jump. Collect the stars!</p>
      </header>
      <main>
        <PhaserGameComponent />
      </main>
      <footer>
        <p>Powered by Phaser 3 & React</p>
      </footer>
    </div>
  );
}

export default App;