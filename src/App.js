// App.js
import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import AvatarSelection from './components/AvatarSelection';
import DifficultySelection from './components/DifficultySelection';
import Game from './components/Game';
import './App.css';

function App() {
  const [screen, setScreen] = useState('welcome');
  const [playerData, setPlayerData] = useState({});
  const [difficulty, setDifficulty] = useState('');

  const handleStartGame = (data) => {
    setPlayerData(data); // Salvar dados do jogador, incluindo avatar e nickname
    setScreen('difficultySelection'); // Mudar para a tela de seleção de dificuldade
  };

  const handleDifficultySelect = (level) => {
    setDifficulty(level);
    setScreen('game'); // Mudar para a tela do jogo após selecionar a dificuldade
  };

  return (
    <div className="App">
      {screen === 'welcome' && <WelcomeScreen onPlay={() => setScreen('avatarSelection')} />}
      {screen === 'avatarSelection' && <AvatarSelection onAvatarSelect={handleStartGame} />}
      {screen === 'difficultySelection' && <DifficultySelection onDifficultySelect={handleDifficultySelect} />}
      {screen === 'game' && <Game selectedAvatar={playerData.avatar} nickname={playerData.nickname} difficulty={difficulty} />} {/* Passando o nickname */}
    </div>
  );
}

export default App;
