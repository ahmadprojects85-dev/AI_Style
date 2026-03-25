// ── Stylist Chat Route ──
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { chatWithStylist } from '../services/openai.js';

const router = Router();

// ── POST /api/chat — Contextual Look Q&A ──
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { message, history, context } = req.body;
  console.log('[Chat Route] Received message:', message);
  console.log('[Chat Route] Context check:', context ? 'OK' : 'MISSING');

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!context) {
    return res.status(400).json({ error: 'Outfit context is required' });
  }

  const reply = await chatWithStylist(
    message.trim(),
    history || [],
    context
  );

  res.json({ reply });
}));

export default router;
