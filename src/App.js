import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import AvatarSelection from './components/AvatarSelection';
import './App.css';

function App() {
    const [screen, setScreen] = useState('welcome');
    const [playerData, setPlayerData] = useState({});

    const handleStartGame = (data) => {
        setPlayerData(data); // Salvar dados do jogador
        setScreen('game'); // Mudar para a tela do jogo
    };

    return (
        <div className="App">
            {screen === 'welcome' && <WelcomeScreen onPlay={() => setScreen('avatarSelection')} />}
            {screen === 'avatarSelection' && <AvatarSelection onAvatarSelect={handleStartGame} />}
            {screen === 'game' && <div>Início do Jogo com {playerData.nickname} e avatar {playerData.avatar}</div>}
        </div>
    );
}

export default App;
