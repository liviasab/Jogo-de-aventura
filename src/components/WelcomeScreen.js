import React from 'react';
import './WelcomeScreen.css'; // Arquivo CSS para estilos

const WelcomeScreen = ({ onStartGame }) => {
  return (
    <div className="welcome-screen">
      <h1 className="welcome-title">Bem-vindos ao Jogo de Aventura!</h1>
      <img 
        src="/play-button.png" 
        alt="Botão Play" 
        className="play-image" 
        onClick={onStartGame} 
      />
    </div>
  );
};

export default WelcomeScreen;
