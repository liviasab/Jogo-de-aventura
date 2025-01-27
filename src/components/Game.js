import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Game.css";

// Função para criar um nó de lista encadeada
class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

// Lista encadeada para gerenciar os blocos
class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  add(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  removeFirst() {
    if (this.head) {
      this.head = this.head.next;
    }
  }

  toArray() {
    const array = [];
    let current = this.head;
    while (current) {
      array.push(current.value);
      current = current.next;
    }
    return array;
  }
}

const Game = ({ selectedAvatar, difficulty }) => {
  const [blocks, setBlocks] = useState(new LinkedList());
  const [playerPosition, setPlayerPosition] = useState({ x: 10, y: 150 }); // Posição fixa da Milta
  const [score, setScore] = useState(0);
  const [life, setLife] = useState(5);
  const [energy, setEnergy] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const gameContainerRef = useRef(null);

  const blockImages = {
    normal: "./normal-block.png",
    explosive: "./explosive-block.png",
    energy: "./energy-block.png",
    bonus: "./bonus-block.png",
  };

  // Gerar blocos aleatórios
  const generateBlock = useCallback(() => {
    const blockTypes = ["normal", "explosive", "energy", "bonus"];
    const randomType = blockTypes[Math.floor(Math.random() * blockTypes.length)];

    return {
      type: randomType,
      x: window.innerWidth - 80,
      y: 300 + Math.floor(Math.random() * 50), // Posição Y aleatória
    };
  }, []);

  // Atualizar os blocos (movê-los para a esquerda)
  const updateBlocks = useCallback(() => {
    const updatedBlocks = new LinkedList();
    let current = blocks.head;
    let lastBlockX = -1;
    while (current) {
      const block = current.value;
      block.x -= 5; // Move os blocos para a esquerda
      if (block.x > -80) {
        updatedBlocks.add(block);
        lastBlockX = block.x;
      }
      current = current.next;
    }

    // Adicionar novos blocos aleatórios
    if (lastBlockX === -1 || lastBlockX < window.innerWidth - 300) {
      updatedBlocks.add(generateBlock());
    }

    setBlocks(updatedBlocks);
  }, [blocks, generateBlock]);

  // Lógica de pulo da Milta
  const handleJump = useCallback(() => {
    if (isJumping) return; // Impede múltiplos saltos
    setIsJumping(true);

    const jumpHeight = 100;
    const jumpDuration = 500;

    const initialY = playerPosition.y;

    // Salto para cima
    setPlayerPosition((prev) => ({ ...prev, y: initialY - jumpHeight }));

    setTimeout(() => {
      setPlayerPosition({ x: playerPosition.x, y: initialY }); // Retorna à posição original
      setIsJumping(false);
    }, jumpDuration);
  }, [playerPosition, isJumping]);

  // Verificar colisões
  const checkCollisions = useCallback(() => {
    let current = blocks.head;
    while (current) {
      const block = current.value;

      // Verifica se Milta colidiu com um bloco
      if (
        block.x < playerPosition.x + 60 &&
        block.x + 60 > playerPosition.x &&
        playerPosition.y + 60 >= block.y
      ) {
        if (block.type === "explosive") {
          if (energy > 0) {
            setEnergy((prev) => prev - 1);
          } else {
            setLife((prev) => prev - 1);
            if (life <= 0) setGameOver(true);
          }
        } else if (block.type === "energy") {
          setEnergy((prev) => prev + 1);
        } else if (block.type === "bonus") {
          setScore((prev) => prev + 10);
        } else {
          setScore((prev) => prev + 1);
        }
      }

      current = current.next;
    }
  }, [blocks, playerPosition, energy, life]);

  useEffect(() => {
    if (gameOver) return;

    const gameInterval = setInterval(() => {
      updateBlocks();
      checkCollisions();
    }, 100);

    return () => clearInterval(gameInterval);
  }, [updateBlocks, checkCollisions, gameOver]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        handleJump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleJump]);

  if (gameOver) {
    return <div className="game-over">Game Over! Pontuação: {score}</div>;
  }

  return (
    <div className="game-container" ref={gameContainerRef}>
      <div className="avatar game-avatar" style={{ left: playerPosition.x, top: playerPosition.y }}>
        <img src={`/${selectedAvatar}.png`} alt="Milta" />
      </div>
      <div className="status">
        <div className="life">❤️ {life}</div>
        <div className="energy">⚡ {energy}</div>
        <div className="score">Pontuação: {score}</div>
      </div>
      <div className="blocks-container">
        {blocks.toArray().map((block, index) => (
          <div
            key={index}
            className="block"
            style={{ left: block.x, position: "absolute", bottom: 0 }}
          >
            <img src={blockImages[block.type]} alt={block.type} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Game;
