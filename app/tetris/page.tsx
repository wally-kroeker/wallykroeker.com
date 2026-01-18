'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

// ============================================================================
// CONSTANTS
// ============================================================================

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30;
const MAX_PARTICLES = 200;

// Line scores (NES Tetris)
const LINE_SCORES = [0, 40, 100, 300, 1200];
// Drop speeds in ms (per level 0-9)
const DROP_SPEEDS = [1000, 900, 800, 700, 600, 500, 400, 300, 200, 100];

// Particle colors (Level 1 "Pixel Genesis" theme)
const PARTICLE_COLORS = ['#9BBC0F', '#8BAC0F', '#306230', '#0F380F'];

// Tetromino definitions - NES Tetris standard
const PIECES: Record<string, { color: string; blocks: number[][][] }> = {
  I: {
    color: '#00F0F0',
    blocks: [
      [[0, 0], [1, 0], [2, 0], [3, 0]],
      [[1, -1], [1, 0], [1, 1], [1, 2]],
      [[0, 1], [1, 1], [2, 1], [3, 1]],
      [[2, -1], [2, 0], [2, 1], [2, 2]]
    ]
  },
  O: {
    color: '#F0F000',
    blocks: [
      [[0, 0], [1, 0], [0, 1], [1, 1]],
      [[0, 0], [1, 0], [0, 1], [1, 1]],
      [[0, 0], [1, 0], [0, 1], [1, 1]],
      [[0, 0], [1, 0], [0, 1], [1, 1]]
    ]
  },
  T: {
    color: '#A000F0',
    blocks: [
      [[1, 0], [0, 1], [1, 1], [2, 1]],
      [[1, 0], [1, 1], [2, 1], [1, 2]],
      [[0, 1], [1, 1], [2, 1], [1, 2]],
      [[1, 0], [0, 1], [1, 1], [1, 2]]
    ]
  },
  S: {
    color: '#00F000',
    blocks: [
      [[1, 0], [2, 0], [0, 1], [1, 1]],
      [[1, 0], [1, 1], [2, 1], [2, 2]],
      [[1, 1], [2, 1], [0, 2], [1, 2]],
      [[0, 0], [0, 1], [1, 1], [1, 2]]
    ]
  },
  Z: {
    color: '#F00000',
    blocks: [
      [[0, 0], [1, 0], [1, 1], [2, 1]],
      [[2, 0], [1, 1], [2, 1], [1, 2]],
      [[0, 1], [1, 1], [1, 2], [2, 2]],
      [[1, 0], [0, 1], [1, 1], [0, 2]]
    ]
  },
  J: {
    color: '#0000F0',
    blocks: [
      [[0, 0], [0, 1], [1, 1], [2, 1]],
      [[1, 0], [2, 0], [1, 1], [1, 2]],
      [[0, 1], [1, 1], [2, 1], [2, 2]],
      [[1, 0], [1, 1], [0, 2], [1, 2]]
    ]
  },
  L: {
    color: '#F0A000',
    blocks: [
      [[2, 0], [0, 1], [1, 1], [2, 1]],
      [[1, 0], [1, 1], [1, 2], [2, 2]],
      [[0, 1], [1, 1], [2, 1], [0, 2]],
      [[0, 0], [1, 0], [1, 1], [1, 2]]
    ]
  }
};

const PIECE_TYPES = Object.keys(PIECES);

// ============================================================================
// TYPES
// ============================================================================

interface Cell {
  filled: boolean;
  color: string | null;
}

interface Piece {
  type: string;
  color: string;
  rotation: number;
  x: number;
  y: number;
}

interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  lifetime: number;
  maxLifetime: number;
  size: number;
}

interface HighScore {
  initials: string;
  score: number;
  level: number;
  date: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function createEmptyBoard(): Cell[][] {
  return Array(BOARD_HEIGHT).fill(null).map(() =>
    Array(BOARD_WIDTH).fill(null).map(() => ({ filled: false, color: null }))
  );
}

function createPiece(type: string): Piece {
  return {
    type,
    color: PIECES[type].color,
    rotation: 0,
    x: 3,
    y: -2
  };
}

function randomPiece(): Piece {
  const type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
  return createPiece(type);
}

function getBlocks(piece: Piece): { x: number; y: number }[] {
  return PIECES[piece.type].blocks[piece.rotation].map(([dx, dy]) => ({
    x: piece.x + dx,
    y: piece.y + dy
  }));
}

function clonePiece(piece: Piece): Piece {
  return { ...piece };
}

function canPlacePiece(piece: Piece, board: Cell[][]): boolean {
  const blocks = getBlocks(piece);
  for (const block of blocks) {
    if (block.x < 0 || block.x >= BOARD_WIDTH || block.y >= BOARD_HEIGHT) {
      return false;
    }
    if (block.y >= 0 && board[block.y][block.x].filled) {
      return false;
    }
  }
  return true;
}

// ============================================================================
// AUDIO MANAGER
// ============================================================================

class AudioManager {
  private ctx: AudioContext | null = null;
  private initialized = false;
  private volume = 0.5;
  private muted = false;
  private masterGain: GainNode | null = null;
  private activeSounds = new Set<OscillatorNode>();

  async init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.gain.value = this.muted ? 0 : this.volume;
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize AudioManager:', error);
    }
  }

  async ensureRunning() {
    if (!this.initialized) await this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  setVolume(percent: number) {
    this.volume = Math.max(0, Math.min(100, percent)) / 100;
    if (this.masterGain && !this.muted) {
      this.masterGain.gain.value = this.volume;
    }
  }

  getVolume() {
    return Math.round(this.volume * 100);
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain) {
      this.masterGain.gain.value = this.muted ? 0 : this.volume;
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  async play(soundName: string, data?: number) {
    await this.ensureRunning();
    if (!this.ctx || !this.masterGain) return;

    switch (soundName) {
      case 'move': this.playMove(); break;
      case 'rotate': this.playRotate(); break;
      case 'softDrop': this.playSoftDrop(); break;
      case 'lock': this.playLock(); break;
      case 'lineClear': this.playLineClear(data || 1); break;
      case 'levelUp': this.playLevelUp(); break;
      case 'gameOver': this.playGameOver(); break;
    }
  }

  private playMove() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 150;
    osc.connect(gain);
    gain.connect(this.masterGain);
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.005);
    gain.gain.linearRampToValueAtTime(0, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
    this.activeSounds.add(osc);
    osc.onended = () => this.activeSounds.delete(osc);
  }

  private playRotate() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(400, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.masterGain);
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
    this.activeSounds.add(osc);
    osc.onended = () => this.activeSounds.delete(osc);
  }

  private playSoftDrop() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.masterGain);
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);
    this.activeSounds.add(osc);
    osc.onended = () => this.activeSounds.delete(osc);
  }

  private playLock() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.masterGain);
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);
    this.activeSounds.add(osc);
    osc.onended = () => this.activeSounds.delete(osc);
  }

  private playLineClear(lineCount: number) {
    if (!this.ctx || !this.masterGain) return;
    const frequencies: Record<number, number> = { 1: 400, 2: 500, 3: 600, 4: 800 };
    const baseFreq = frequencies[lineCount] || 400;
    const duration = lineCount === 4 ? 0.4 : 0.2;

    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.value = baseFreq;
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    const now = this.ctx.currentTime;
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.linearRampToValueAtTime(0, now + duration);
    osc1.start(now);
    osc1.stop(now + duration);
    this.activeSounds.add(osc1);
    osc1.onended = () => this.activeSounds.delete(osc1);

    if (lineCount === 4) {
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.value = baseFreq * 1.5;
      osc2.connect(gain2);
      gain2.connect(this.masterGain);
      gain2.gain.setValueAtTime(0.2, now + 0.05);
      gain2.gain.linearRampToValueAtTime(0, now + duration);
      osc2.start(now + 0.05);
      osc2.stop(now + duration);
      this.activeSounds.add(osc2);
      osc2.onended = () => this.activeSounds.delete(osc2);
    }
  }

  private playLevelUp() {
    if (!this.ctx || !this.masterGain) return;
    const notes = [400, 500, 600, 800];
    const noteLength = 0.1;
    const now = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(this.masterGain!);
      const startTime = now + (i * noteLength);
      const endTime = startTime + noteLength * 1.5;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + 0.02);
      gain.gain.linearRampToValueAtTime(0, endTime);
      osc.start(startTime);
      osc.stop(endTime);
      this.activeSounds.add(osc);
      osc.onended = () => this.activeSounds.delete(osc);
    });

    const finalTime = now + (notes.length * noteLength);
    [400, 500, 600, 800].forEach(freq => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(this.masterGain!);
      gain.gain.setValueAtTime(0.15, finalTime);
      gain.gain.linearRampToValueAtTime(0, finalTime + 0.2);
      osc.start(finalTime);
      osc.stop(finalTime + 0.2);
      this.activeSounds.add(osc);
      osc.onended = () => this.activeSounds.delete(osc);
    });
  }

  private playGameOver() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 1.0);
    osc.connect(gain);
    gain.connect(this.masterGain);
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0, now + 1.0);
    osc.start(now);
    osc.stop(now + 1.0);
    this.activeSounds.add(osc);
    osc.onended = () => this.activeSounds.delete(osc);
  }

  dispose() {
    this.activeSounds.forEach(sound => {
      try { sound.stop(); } catch { /* Already stopped */ }
    });
    this.activeSounds.clear();
    if (this.ctx) this.ctx.close();
  }
}

// ============================================================================
// PARTICLE SYSTEM
// ============================================================================

class ParticleSystem {
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private activeCount = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.particles.push({
        active: false, x: 0, y: 0, vx: 0, vy: 0,
        color: PARTICLE_COLORS[0], alpha: 1,
        lifetime: 0, maxLifetime: 1, size: 4
      });
    }
  }

  getParticle(): Particle | null {
    for (let i = 0; i < MAX_PARTICLES; i++) {
      if (!this.particles[i].active) return this.particles[i];
    }
    return null;
  }

  emitLineClear(clearedLines: number[], lineCount: number) {
    const particleCounts: Record<number, number> = { 1: 20, 2: 40, 3: 60, 4: 100 };
    const count = particleCounts[lineCount] || 20;
    const isTetris = lineCount === 4;
    const velocityMultiplier = isTetris ? 1.5 : 1.0;

    clearedLines.forEach(lineY => {
      const particlesPerLine = Math.floor(count / lineCount);
      for (let i = 0; i < particlesPerLine; i++) {
        const particle = this.getParticle();
        if (!particle) break;

        const x = Math.random() * 10 * BLOCK_SIZE;
        const y = lineY * BLOCK_SIZE + BLOCK_SIZE / 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = (50 + Math.random() * 150) * velocityMultiplier;

        particle.active = true;
        particle.x = x;
        particle.y = y;
        particle.vx = Math.cos(angle) * speed;
        particle.vy = Math.sin(angle) * speed - 50;
        particle.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        particle.alpha = 1;
        particle.lifetime = 0;
        particle.maxLifetime = 0.5 + Math.random() * 0.5;
        particle.size = isTetris ? 4 + Math.random() * 4 : 3 + Math.random() * 3;

        this.activeCount++;
      }
    });
  }

  update(deltaTime: number) {
    const dt = deltaTime / 1000;
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = this.particles[i];
      if (!p.active) continue;

      p.lifetime += dt;
      if (p.lifetime >= p.maxLifetime) {
        p.active = false;
        this.activeCount--;
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 200 * dt;
      p.vx *= 0.98;
      p.vy *= 0.98;
      const progress = p.lifetime / p.maxLifetime;
      p.alpha = 1 - progress;
    }
  }

  render() {
    if (this.activeCount === 0) return;
    this.ctx.save();
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = this.particles[i];
      if (!p.active) continue;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
    this.ctx.restore();
  }

  reset() {
    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.particles[i].active = false;
    }
    this.activeCount = 0;
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TetrisPage() {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nextPieceCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<AudioManager | null>(null);
  const particlesRef = useRef<ParticleSystem | null>(null);
  const gameLoopRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const lastDropTimeRef = useRef<number>(0);
  const dasTimersRef = useRef<Record<string, NodeJS.Timeout>>({});
  const keysRef = useRef<Record<string, boolean>>({});

  // Game state
  const [board, setBoard] = useState<Cell[][]>(createEmptyBoard);
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece>(randomPiece);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameStatus, setGameStatus] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const [showHighScoreForm, setShowHighScoreForm] = useState(false);
  const [initials, setInitials] = useState('');
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);

  // Load high scores
  const loadHighScores = useCallback(async () => {
    try {
      const response = await fetch('/api/tetris/highscores');
      if (response.ok) {
        const data = await response.json();
        setHighScores(data.scores || []);
      }
    } catch (error) {
      console.error('Error loading high scores:', error);
    }
  }, []);

  // Submit high score
  const submitHighScore = useCallback(async () => {
    if (!/^[A-Z]{3}$/.test(initials)) {
      alert('Please enter exactly 3 letters');
      return;
    }
    try {
      const response = await fetch('/api/tetris/highscores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initials, score, level })
      });
      if (response.ok) {
        await loadHighScores();
        setShowHighScoreForm(false);
        setInitials('');
      }
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  }, [initials, score, level, loadHighScores]);

  // Start game
  const startGame = useCallback(() => {
    const newBoard = createEmptyBoard();
    const newCurrentPiece = randomPiece();
    const newNextPiece = randomPiece();

    setBoard(newBoard);
    setCurrentPiece(newCurrentPiece);
    setNextPiece(newNextPiece);
    setScore(0);
    setLevel(0);
    setLines(0);
    setGameStatus('playing');
    setShowHighScoreForm(false);
    lastDropTimeRef.current = Date.now();

    if (particlesRef.current) {
      particlesRef.current.reset();
    }
  }, []);

  // Game logic functions using refs for current state
  const boardRef = useRef(board);
  const currentPieceRef = useRef(currentPiece);
  const nextPieceRef = useRef(nextPiece);
  const scoreRef = useRef(score);
  const levelRef = useRef(level);
  const linesRef = useRef(lines);
  const gameStatusRef = useRef(gameStatus);

  // Keep refs in sync
  useEffect(() => { boardRef.current = board; }, [board]);
  useEffect(() => { currentPieceRef.current = currentPiece; }, [currentPiece]);
  useEffect(() => { nextPieceRef.current = nextPiece; }, [nextPiece]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { levelRef.current = level; }, [level]);
  useEffect(() => { linesRef.current = lines; }, [lines]);
  useEffect(() => { gameStatusRef.current = gameStatus; }, [gameStatus]);

  // Move piece
  const movePiece = useCallback((dx: number, dy: number): boolean => {
    if (gameStatusRef.current !== 'playing' || !currentPieceRef.current) return false;

    const clone = clonePiece(currentPieceRef.current);
    clone.x += dx;
    clone.y += dy;

    if (canPlacePiece(clone, boardRef.current)) {
      setCurrentPiece(clone);
      return true;
    }
    return false;
  }, []);

  // Rotate piece
  const rotatePiece = useCallback((): boolean => {
    if (gameStatusRef.current !== 'playing' || !currentPieceRef.current) return false;

    const clone = clonePiece(currentPieceRef.current);
    clone.rotation = (clone.rotation + 1) % 4;

    if (canPlacePiece(clone, boardRef.current)) {
      setCurrentPiece(clone);
      audioRef.current?.play('rotate');
      return true;
    }
    return false;
  }, []);

  // Lock piece and check for lines
  const lockPiece = useCallback(() => {
    if (!currentPieceRef.current) return;

    const newBoard = boardRef.current.map(row => row.map(cell => ({ ...cell })));
    const blocks = getBlocks(currentPieceRef.current);

    for (const block of blocks) {
      if (block.y >= 0 && block.y < BOARD_HEIGHT) {
        newBoard[block.y][block.x] = {
          filled: true,
          color: currentPieceRef.current.color
        };
      }
    }

    // Check for completed lines
    const completedLines: number[] = [];
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (newBoard[y].every(cell => cell.filled)) {
        completedLines.push(y);
      }
    }

    // Clear lines
    if (completedLines.length > 0) {
      completedLines.sort((a, b) => a - b);
      for (const line of completedLines) {
        newBoard.splice(line, 1);
        newBoard.unshift(Array(BOARD_WIDTH).fill(null).map(() => ({ filled: false, color: null })));
      }

      // Calculate score
      const points = LINE_SCORES[completedLines.length] * (levelRef.current + 1);
      const newLines = linesRef.current + completedLines.length;
      const newLevel = Math.min(Math.floor(newLines / 10), 9);
      const leveledUp = newLevel > levelRef.current;

      setScore(s => s + points);
      setLines(newLines);
      setLevel(newLevel);

      // Audio and particles
      audioRef.current?.play('lineClear', completedLines.length);
      particlesRef.current?.emitLineClear(completedLines, completedLines.length);

      if (leveledUp) {
        audioRef.current?.play('levelUp');
      }
    }

    setBoard(newBoard);
    audioRef.current?.play('lock');

    // Spawn next piece
    const newCurrentPiece = nextPieceRef.current;
    const newNextPiece = randomPiece();

    // Check game over
    if (!canPlacePiece(newCurrentPiece, newBoard)) {
      setGameStatus('gameOver');
      audioRef.current?.play('gameOver');

      // Check if score qualifies for high score
      if (highScores.length < 10 || scoreRef.current > (highScores[highScores.length - 1]?.score || 0)) {
        setShowHighScoreForm(true);
      }
      return;
    }

    setCurrentPiece(newCurrentPiece);
    setNextPiece(newNextPiece);
  }, [highScores]);

  // Move down
  const moveDown = useCallback((): boolean => {
    if (gameStatusRef.current !== 'playing' || !currentPieceRef.current) return false;

    const clone = clonePiece(currentPieceRef.current);
    clone.y += 1;

    if (canPlacePiece(clone, boardRef.current)) {
      setCurrentPiece(clone);
      return true;
    } else {
      lockPiece();
      return false;
    }
  }, [lockPiece]);

  // Soft drop
  const softDrop = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return;

    let rows = 0;
    while (true) {
      const clone = clonePiece(currentPieceRef.current!);
      clone.y += 1;
      if (canPlacePiece(clone, boardRef.current)) {
        setCurrentPiece(clone);
        currentPieceRef.current = clone;
        rows++;
      } else {
        break;
      }
    }

    if (rows > 0) {
      setScore(s => s + rows);
      audioRef.current?.play('softDrop');
    }
    lockPiece();
  }, [lockPiece]);

  // Toggle pause
  const togglePause = useCallback(() => {
    if (gameStatusRef.current === 'playing') {
      setGameStatus('paused');
    } else if (gameStatusRef.current === 'paused') {
      setGameStatus('playing');
      lastDropTimeRef.current = Date.now();
    }
  }, []);

  // DAS (Delayed Auto Shift)
  const startDAS = useCallback((key: string, action: () => void) => {
    if (dasTimersRef.current[key]) {
      clearInterval(dasTimersRef.current[key]);
    }
    setTimeout(() => {
      if (keysRef.current[key]) {
        dasTimersRef.current[key] = setInterval(() => {
          if (!keysRef.current[key]) {
            clearInterval(dasTimersRef.current[key]);
            delete dasTimersRef.current[key];
          } else {
            action();
          }
        }, 50);
      }
    }, 200);
  }, []);

  // Initialize audio and particles
  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      particlesRef.current = new ParticleSystem(ctx);
    }

    audioRef.current = new AudioManager();

    // Initialize audio on first interaction
    const initAudio = async () => {
      await audioRef.current?.init();
      document.removeEventListener('keydown', initAudio);
      document.removeEventListener('click', initAudio);
    };

    document.addEventListener('keydown', initAudio, { once: true });
    document.addEventListener('click', initAudio, { once: true });

    loadHighScores();

    return () => {
      audioRef.current?.dispose();
    };
  }, [loadHighScores]);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (['arrowleft', 'arrowright', 'arrowdown', 'arrowup', ' ', 'p', 'z'].includes(key)) {
        e.preventDefault();
      }

      if (keysRef.current[key]) return;
      keysRef.current[key] = true;

      if (gameStatusRef.current === 'menu') {
        startGame();
        return;
      }

      switch (key) {
        case 'arrowup':
        case 'z':
          rotatePiece();
          break;
        case ' ':
          softDrop();
          break;
        case 'p':
          togglePause();
          break;
        case 'arrowleft':
          if (movePiece(-1, 0)) audioRef.current?.play('move');
          startDAS('arrowleft', () => { if (movePiece(-1, 0)) audioRef.current?.play('move'); });
          break;
        case 'arrowright':
          if (movePiece(1, 0)) audioRef.current?.play('move');
          startDAS('arrowright', () => { if (movePiece(1, 0)) audioRef.current?.play('move'); });
          break;
        case 'arrowdown':
          moveDown();
          startDAS('arrowdown', moveDown);
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current[key] = false;

      if (dasTimersRef.current[key]) {
        clearInterval(dasTimersRef.current[key]);
        delete dasTimersRef.current[key];
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      Object.values(dasTimersRef.current).forEach(clearInterval);
    };
  }, [movePiece, rotatePiece, softDrop, togglePause, moveDown, startDAS, startGame]);

  // Game loop
  useEffect(() => {
    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Update game logic
      if (gameStatusRef.current === 'playing') {
        const dropSpeed = DROP_SPEEDS[levelRef.current];
        const now = Date.now();

        if (now - lastDropTimeRef.current >= dropSpeed) {
          moveDown();
          lastDropTimeRef.current = now;
        }
      }

      // Update particles
      particlesRef.current?.update(deltaTime);

      // Render
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        // Clear
        ctx.fillStyle = '#0F380F';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid
        ctx.strokeStyle = 'rgba(155, 188, 15, 0.1)';
        ctx.lineWidth = 1;
        for (let y = 0; y <= BOARD_HEIGHT; y++) {
          ctx.beginPath();
          ctx.moveTo(0, y * BLOCK_SIZE);
          ctx.lineTo(BOARD_WIDTH * BLOCK_SIZE, y * BLOCK_SIZE);
          ctx.stroke();
        }
        for (let x = 0; x <= BOARD_WIDTH; x++) {
          ctx.beginPath();
          ctx.moveTo(x * BLOCK_SIZE, 0);
          ctx.lineTo(x * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
          ctx.stroke();
        }

        // Draw board
        for (let y = 0; y < BOARD_HEIGHT; y++) {
          for (let x = 0; x < BOARD_WIDTH; x++) {
            const cell = boardRef.current[y][x];
            if (cell.filled && cell.color) {
              drawBlock(ctx, x, y, cell.color);
            }
          }
        }

        // Draw current piece and ghost
        if (currentPieceRef.current && gameStatusRef.current === 'playing') {
          // Ghost piece
          let ghostY = currentPieceRef.current.y;
          const testPiece = clonePiece(currentPieceRef.current);
          while (true) {
            testPiece.y++;
            if (!canPlacePiece(testPiece, boardRef.current)) break;
            ghostY = testPiece.y;
          }

          if (ghostY > currentPieceRef.current.y) {
            const blocks = getBlocks(currentPieceRef.current);
            ctx.globalAlpha = 0.3;
            for (const block of blocks) {
              const y = block.y + (ghostY - currentPieceRef.current.y);
              if (y >= 0) drawBlock(ctx, block.x, y, currentPieceRef.current.color);
            }
            ctx.globalAlpha = 1.0;
          }

          // Current piece
          const blocks = getBlocks(currentPieceRef.current);
          for (const block of blocks) {
            if (block.y >= 0) drawBlock(ctx, block.x, block.y, currentPieceRef.current.color);
          }
        }

        // Draw particles
        particlesRef.current?.render();
      }

      // Draw next piece
      const nextCanvas = nextPieceCanvasRef.current;
      const nextCtx = nextCanvas?.getContext('2d');
      if (nextCanvas && nextCtx && nextPieceRef.current) {
        nextCtx.fillStyle = '#0F380F';
        nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

        const blocks = getBlocks(nextPieceRef.current);
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        for (const block of blocks) {
          minX = Math.min(minX, block.x);
          maxX = Math.max(maxX, block.x);
          minY = Math.min(minY, block.y);
          maxY = Math.max(maxY, block.y);
        }

        const width = maxX - minX + 1;
        const height = maxY - minY + 1;
        const offsetX = (4 - width) / 2 - minX;
        const offsetY = (4 - height) / 2 - minY;

        for (const block of blocks) {
          const x = (block.x + offsetX) * BLOCK_SIZE;
          const y = (block.y + offsetY) * BLOCK_SIZE;

          nextCtx.fillStyle = nextPieceRef.current.color;
          nextCtx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
          nextCtx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
          nextCtx.lineWidth = 2;
          nextCtx.strokeRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
        }
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    lastTimeRef.current = performance.now();
    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveDown]);

  // Helper to draw a block
  const drawBlock = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    const pixelX = x * BLOCK_SIZE;
    const pixelY = y * BLOCK_SIZE;

    ctx.fillStyle = color;
    ctx.fillRect(pixelX, pixelY, BLOCK_SIZE, BLOCK_SIZE);

    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(pixelX, pixelY, BLOCK_SIZE, BLOCK_SIZE);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pixelX, pixelY + BLOCK_SIZE);
    ctx.lineTo(pixelX, pixelY);
    ctx.lineTo(pixelX + BLOCK_SIZE, pixelY);
    ctx.stroke();
  };

  // Volume control
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    audioRef.current?.setVolume(newVolume);
    if (audioRef.current?.isMuted()) {
      audioRef.current?.toggleMute();
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    const muted = audioRef.current?.toggleMute() || false;
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0F380F' }}>
      <div className="flex gap-10 items-start" style={{ fontFamily: "'Courier New', monospace", color: '#9BBC0F' }}>
        {/* Game Canvas */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={BOARD_WIDTH * BLOCK_SIZE}
            height={BOARD_HEIGHT * BLOCK_SIZE}
            style={{ imageRendering: 'pixelated' }}
          />

          {/* Menu Overlay */}
          {gameStatus === 'menu' && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.8)' }}>
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">ULTIMATE TETRIS</h1>
                <p className="mb-4">Press any key to start</p>
              </div>
            </div>
          )}

          {/* Pause Overlay */}
          {gameStatus === 'paused' && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.8)' }}>
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">PAUSED</h1>
                <p>Press P to resume</p>
              </div>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameStatus === 'gameOver' && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.9)' }}>
              <div className="text-center p-8">
                <h1 className="text-3xl font-bold mb-4">GAME OVER</h1>
                <p className="text-2xl font-bold mb-4">{score.toLocaleString()}</p>

                {showHighScoreForm && (
                  <div className="mb-4">
                    <input
                      type="text"
                      value={initials}
                      onChange={(e) => setInitials(e.target.value.toUpperCase())}
                      maxLength={3}
                      placeholder="AAA"
                      className="text-2xl text-center w-20 p-2 rounded"
                      style={{ background: '#0F380F', color: '#9BBC0F', border: '2px solid #9BBC0F' }}
                    />
                    <button
                      onClick={submitHighScore}
                      className="ml-2 px-4 py-2 rounded"
                      style={{ background: '#9BBC0F', color: '#0F380F' }}
                    >
                      Submit
                    </button>
                  </div>
                )}

                <button
                  onClick={startGame}
                  className="px-6 py-2 rounded text-lg"
                  style={{ background: '#9BBC0F', color: '#0F380F' }}
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* UI Panel */}
        <div className="flex flex-col gap-6" style={{ minWidth: '200px' }}>
          <div className="p-4 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <h2 className="text-sm uppercase tracking-widest mb-2">Score</h2>
            <div className="text-2xl font-bold">{score.toLocaleString()}</div>
          </div>

          <div className="p-4 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <h2 className="text-sm uppercase tracking-widest mb-2">Level</h2>
            <div className="text-2xl font-bold">{level + 1}</div>
          </div>

          <div className="p-4 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <h2 className="text-sm uppercase tracking-widest mb-2">Lines</h2>
            <div className="text-2xl font-bold">{lines}</div>
          </div>

          <div className="p-4 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <h2 className="text-sm uppercase tracking-widest mb-2">Next</h2>
            <canvas
              ref={nextPieceCanvasRef}
              width={120}
              height={120}
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          <div className="p-4 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <h2 className="text-sm uppercase tracking-widest mb-2">High Scores</h2>
            <div className="text-sm" style={{ lineHeight: '1.8' }}>
              {highScores.length === 0 ? 'No scores yet!' : highScores.slice(0, 10).map((hs, i) => (
                <div key={i}>{i + 1}. {hs.initials} - {hs.score.toLocaleString()}</div>
              ))}
            </div>
          </div>

          <div className="text-xs" style={{ lineHeight: '1.8' }}>
            <h3 className="text-sm mb-2">Controls</h3>
            <div>Arrow Left/Right : Move</div>
            <div>Arrow Down : Soft Drop</div>
            <div>Arrow Up / Z : Rotate</div>
            <div>Space : Hard Drop</div>
            <div>P : Pause</div>
          </div>

          <div className="p-4 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <h3 className="text-sm mb-2">Audio</h3>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1"
                style={{ accentColor: '#9BBC0F' }}
              />
              <button
                onClick={handleMuteToggle}
                className="px-3 py-1 text-xs rounded"
                style={{
                  background: 'rgba(155, 188, 15, 0.2)',
                  border: '1px solid #9BBC0F',
                  minWidth: '60px'
                }}
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
