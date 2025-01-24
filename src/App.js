import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import AvatarSelection from './components/AvatarSelection';
import DifficultySelection from './components/DifficultySelection'; // Importar a nova tela de seleção de dificuldade
import './App.css';

function App() {
    const [screen, setScreen] = useState('welcome');
    const [playerData, setPlayerData] = useState({});
    const [difficulty, setDifficulty] = useState(''); // Estado para armazenar a dificuldade selecionada

    const handleStartGame = (data) => {
        setPlayerData(data); // Salvar dados do jogador
        setScreen('difficultySelection'); // Mudar para a tela de seleção de dificuldade
    };

    const handleDifficultySelect = (level) => {
        setDifficulty(level); // Armazenar a dificuldade selecionada
        setScreen('game'); // Mudar para a tela do jogo
    };

    return (
        <div className="App">
            {screen === 'welcome' && <WelcomeScreen onPlay={() => setScreen('avatarSelection')} />}
            {screen === 'avatarSelection' && <AvatarSelection onAvatarSelect={handleStartGame} />}
            {screen === 'difficultySelection' && (
                <DifficultySelection onDifficultySelect={handleDifficultySelect} />
            )}
            {screen === 'game' && (
                <div>
                    Início do Jogo com {playerData.nickname} e avatar {playerData.avatar} em nível {difficulty}
                </div>
            )}
        </div>
    );
}

export default App;
