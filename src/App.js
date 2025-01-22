import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';

const App = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);

  const startGame = () => {
    setIsGameStarted(true); // Muda para a próxima tela
  };

  return (
    <div>
      {!isGameStarted ? (
        <WelcomeScreen onStartGame={startGame} />
      ) : (
        <div>Bem-vindo à próxima tela (substitua isso pela sua próxima etapa)</div>
      )}
    </div>
  );
};

export default App;
