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

const Game = ({ selectedAvatar, difficulty, nickname  }) => {
  const [blocks, setBlocks] = useState(new LinkedList());
  const [playerPosition, setPlayerPosition] = useState({ x: 100, y: 200 }); // Ajuste a posição inicial da Milta
  const [score, setScore] = useState(0);
  const [life, setLife] = useState(difficulty === "hard" ? 1 : difficulty === "medium" ? 3 : 5);
  const [energy, setEnergy] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isSuperJumping, setIsSuperJumping] = useState(false);
  const [jumpedBlocks, setJumpedBlocks] = useState(new Set());
  const [totalJumpedBlocks, setTotalJumpedBlocks] = useState(0);
  const [totalBombasPuladas, setTotalBombasPuladas] = useState(0);
  const [totalBombasExplodidas, setTotalBombasExplodidas] = useState(0); // Corrigido para usar useState
  const [totalEnergiaCapturada, setTotalEnergiaCapturada] = useState(0);
  const gameContainerRef = useRef(null);
  const [background, setBackground] = useState("");

  useEffect(() => {
    // Definir o fundo com base na dificuldade
    switch (difficulty) {
      case "easy":
        setBackground("url('./easy-background.png')");
        break;
      case "medium":
        setBackground("url('./medium-background.png')");
        break;
      case "hard":
        setBackground("url('./hard-background.png')");
        break;
      default:
        setBackground("url('./default-background.png')");
    }
  }, [difficulty]);

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
      y: 150 + Math.floor(Math.random() * 50), // Ajuste a posição Y dos blocos
    };
  }, []);

  // Atualizar os blocos (movê-los para a esquerda)
  const updateBlocks = useCallback(() => {
    const updatedBlocks = new LinkedList();
    let current = blocks.head; 
    let lastBlockX = -1;
    const blockSpeed = difficulty === "hard" ? 20 : difficulty === "medium" ? 15 : 10;

    while (current) {
      const block = current.value;
      block.x -= blockSpeed; // Move os blocos para a esquerda
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
  }, [blocks, generateBlock, difficulty]);

  // Lógica de pulo da Milta
  const handleJump = useCallback(() => {
    if (isJumping || isSuperJumping) return; // Impede múltiplos saltos
  
    if (energy >= 3) {
      // Super salto
      setIsSuperJumping(true);
      setEnergy(0);
  
      const jumpHeight = 400; // Aumenta a altura do super salto
      const jumpDuration = 3500; // Aumenta a duração do super salto
  
      setPlayerPosition((prev) => ({ ...prev, y: playerPosition.y - jumpHeight }));
  
      setTimeout(() => {
        setPlayerPosition((prev) => ({ ...prev, y: 200 })); // Ajuste a posição de retorno da Milta
        setIsSuperJumping(false);
      }, jumpDuration);
    } else {
      // Salto normal
      setIsJumping(true);
  
      const jumpHeight = 300; // Aumenta a altura do salto normal
      const jumpDuration = 1250; // Aumenta a duração do salto normal
  
      setPlayerPosition((prev) => ({ ...prev, y: playerPosition.y - jumpHeight }));
  
      setTimeout(() => {
        setPlayerPosition((prev) => ({ ...prev, y: 200 })); // Ajuste a posição de retorno da Milta
        setIsJumping(false);
      }, jumpDuration);
    }
    setTotalJumpedBlocks((prev) => prev + 1);
  }, [playerPosition, isJumping, isSuperJumping, energy]);

  // Verificar colisões
  const checkCollisions = useCallback(() => {
    let current = blocks.head;
    const newJumpedBlocks = new Set(jumpedBlocks);

    while (current) {
      const block = current.value;

      // Verifica se o bloco está na mesma faixa horizontal e na faixa de altura da Milta
      const isInHorizontalRange = block.x < playerPosition.x + 70 && block.x + 70 > playerPosition.x; // Colisão horizontal
      const isAboveMilta = block.y < playerPosition.y + 70 && block.y + 70 > playerPosition.y; // Ajuste a altura da Milta conforme necessário

      if (isInHorizontalRange && isAboveMilta) {
        // Verifica se o bloco já foi contabilizado
        if (!newJumpedBlocks.has(block)) {
          newJumpedBlocks.add(block);

          // Lógica de colisão
          if (block.type === "explosive") {
            if (!isSuperJumping) {
              setLife((prev) => prev - 1);
              if (life <= 1) setGameOver(true);
            }
            setTotalBombasExplodidas((prev) => prev + 1); // Contabiliza a bomba explodida
          } else if (block.type === "energy") {
            setEnergy((prev) => Math.min(prev + 1, 3));
            setTotalEnergiaCapturada((prev) => prev + 1); // Contabiliza a energia capturada
          } else if (block.type === "bonus") {
            setScore((prev) => prev + 10);
          } else {
            setScore((prev) => prev + 1);
          }
        }
      } else if (block.type === "explosive" && block.x < playerPosition.x) {
        // Incrementar contagem de bombas puladas se a bomba passou pela Milta
        setTotalBombasPuladas((prev) => prev + 1);
      } else if (block.type !== "explosive" && block.x < playerPosition.x) {
        // Incrementar contagem de blocos pulados, exceto explosivos
        setTotalJumpedBlocks((prev) => prev + 1);
      }

      current = current.next;
    }

    setJumpedBlocks(newJumpedBlocks);
  }, [blocks, playerPosition, isSuperJumping, life, jumpedBlocks]);

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
    return (
        <div className="game-over">
            <h1>Game Over!</h1> {/* Título personalizado */}
            <p>Score: <strong>{score}</strong></p> {/* Adicionando destaque ao score */}
            <p>Total Bricks Skipped: <strong>{totalJumpedBlocks}</strong></p>
            <p>Total Bombs Skipped: <strong>{totalBombasPuladas}</strong></p>
            <p>Total Bombs Exploded: <strong>{totalBombasExplodidas}</strong></p>
            <p>Total Energy Captured: <strong>{totalEnergiaCapturada}</strong></p>
            <p>Nickname: <strong>{nickname}</strong></p> {/* Exibe o nome do jogador */}
        </div>
    );
}


  return (
    <div className="game-container" ref={gameContainerRef} style={{ backgroundImage: background }}>
      <div className={`avatar game-avatar ${isJumping || isSuperJumping ? 'jumping' : ''}`}>
        <img src={`/${selectedAvatar}.png`} alt="Milta" />
      </div>
      <div className="status">
        <div className="life">❤️ {life}</div>
        <div className="energy">⚡ {energy}</div>
        <div className="score">Score: {score}</div>
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
