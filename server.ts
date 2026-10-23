import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction: `You are EduTrack AI, an intelligent academic advisor and campus guide for the EduTrack Student Management System.
You assist students, instructors, and administrators with:
1. Academic schedule and timetable queries (lecture halls, CS-201, DS-101, collision radar).
2. GPA calculation, letter grades, target marks, and honors projections (4.0 scale).
3. Attendance policies (90% minimum threshold, automated absence warnings, rapid roll call).
4. Direct navigation assistance to platform tools (/timetable, /planner, /admin, /teacher, /student, /features, /faq).
Keep responses clear, concise, encouraging, and formatted with markdown bullet points where helpful.`,
      },
    });

    return res.json({ text: response.text });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to generate response';
    console.error('Gemini API Error:', errorMsg);
    return res.status(500).json({ error: errorMsg });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduTrack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
