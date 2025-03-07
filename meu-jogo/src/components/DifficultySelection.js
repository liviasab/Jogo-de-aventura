import React from "react";
import "./DifficultySelection.css"; // Estilos para a tela de seleção de dificuldade

const DifficultySelection = ({ onDifficultySelect }) => {
  return (
    <div className="difficulty-selection">
      <h1>Select the difficulty level!</h1>

      {/* Botões de dificuldade */}
      <div className="difficulty-options">
        <button onClick={() => onDifficultySelect("easy")}>Easy</button>
        <button onClick={() => onDifficultySelect("medium")}>Medium</button>
        <button onClick={() => onDifficultySelect("hard")}>Hard</button>
      </div>
    </div>
  );
};

export default DifficultySelection;
