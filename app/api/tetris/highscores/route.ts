import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface HighScore {
  initials: string;
  score: number;
  level: number;
  date: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const SCORES_FILE = path.join(DATA_DIR, 'tetris-highscores.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readScores(): Promise<HighScore[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(SCORES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeScores(scores: HighScore[]) {
  await ensureDataDir();
  await fs.writeFile(SCORES_FILE, JSON.stringify(scores, null, 2));
}

// GET /api/tetris/highscores
export async function GET() {
  try {
    const scores = await readScores();
    return NextResponse.json({ scores });
  } catch (error) {
    console.error('Error reading high scores:', error);
    return NextResponse.json({ scores: [] });
  }
}

// POST /api/tetris/highscores
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { initials, score, level } = body;

    // Validate input
    if (!initials || typeof initials !== 'string' || !/^[A-Z]{3}$/.test(initials)) {
      return NextResponse.json(
        { error: 'Initials must be exactly 3 uppercase letters' },
        { status: 400 }
      );
    }

    if (typeof score !== 'number' || score < 0) {
      return NextResponse.json(
        { error: 'Invalid score' },
        { status: 400 }
      );
    }

    if (typeof level !== 'number' || level < 0) {
      return NextResponse.json(
        { error: 'Invalid level' },
        { status: 400 }
      );
    }

    // Read current scores
    const scores = await readScores();

    // Add new score
    const newScore: HighScore = {
      initials,
      score,
      level,
      date: new Date().toISOString()
    };

    scores.push(newScore);

    // Sort by score descending, keep top 100
    scores.sort((a, b) => b.score - a.score);
    const topScores = scores.slice(0, 100);

    // Write back
    await writeScores(topScores);

    return NextResponse.json({
      success: true,
      rank: topScores.findIndex(s => s.date === newScore.date) + 1
    });
  } catch (error) {
    console.error('Error saving high score:', error);
    return NextResponse.json(
      { error: 'Failed to save score' },
      { status: 500 }
    );
  }
}
