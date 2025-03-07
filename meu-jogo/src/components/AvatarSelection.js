import React, { useState } from 'react';
import './AvatarSelection.css'; // Estilos para a tela de seleção

const AvatarSelection = ({ onAvatarSelect }) => {
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [nickname, setNickname] = useState('');

    const handleSelect = (avatar) => {
        setSelectedAvatar(avatar);
    };

    const handleStartGame = () => {
        if (selectedAvatar && nickname) {
            onAvatarSelect({ avatar: selectedAvatar, nickname });
        } else {
            alert("Selecione um avatar e digite seu nome!");
        }
    };

    return (
        <div className="avatar-selection">
            <h1>Select your Milta</h1>
            <div className="avatar-options">
                <div className="avatar" onClick={() => handleSelect('milta-todes')}>
                    <img 
                        src="/milta-todes.png" 
                        alt="Milta para todes" 
                        className={selectedAvatar === 'milta-todes' ? 'selected' : ''} 
                    />
                    <h2>Milta for everyone</h2>
                </div>
                <div className="avatar" onClick={() => handleSelect('milta-meninos')}>
                    <img 
                        src="/milta-meninos.png" 
                        alt="Milta para meninos" 
                        className={selectedAvatar === 'milta-meninos' ? 'selected' : ''} 
                    />
                    <h2>Milta for boys</h2>
                </div>
            </div>
            <input
                type="text"
                placeholder="Who will guide Milta?"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
            />
            <button onClick={handleStartGame}>Enter</button>
        </div>
    );
};

export default AvatarSelection;
