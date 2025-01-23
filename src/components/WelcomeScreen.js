// WelcomeScreen.js
import React from 'react';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onPlay }) => { // Alterar 'onStartGame' para 'onPlay'
  return (
    <div className="welcome-screen">
      <h1 className="welcome-title">Bem-vindos ao Jogo de Aventura!</h1>
      <img 
        src="/play-button.png" 
        alt="Botão Play" 
        className="play-image" 
        onClick={onPlay} // Manter a referência correta
      />
    </div>
  );
};

export default WelcomeScreen;  
