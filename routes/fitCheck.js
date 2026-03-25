// ── Fit Check Routes ──
import { Router } from 'express';
import { eq, desc } from 'drizzle-orm';
import db from '../db/index.js';
import { fitChecks, wardrobeItems } from '../db/schema.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { upload } from '../config/upload.js';

import fs from 'fs/promises';
import { getFitCheckAnalysis } from '../services/openai.js';
import { users } from '../db/schema.js';

const router = Router();

// ── Submit Fit Check (AI Analysis) ──
router.post('/',
  authenticate,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an outfit photo' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // Get user preferences and weather
    const [user] = await db.select().from(users).where(eq(users.id, req.user.id)).limit(1);
    
    let weatherData = { temp: 20, condition: 'Clear', description: 'clear sky' };
    if (user.city && process.env.OPENWEATHER_API_KEY) {
      try {
        const apiUnit = user.weatherUnit && user.weatherUnit.includes('F') ? 'imperial' : 'metric';
        let url;
        if (user.city.includes('|')) {
          const [coords] = user.city.split('|');
          const [lat, lon] = coords.split(',');
          url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${apiUnit}&appid=${process.env.OPENWEATHER_API_KEY}`;
        } else {
          let queryStr = user.city;
          const parts = queryStr.split(',').map(p => p.trim());
          if (parts.length === 3) queryStr = `${parts[0]},${parts[2]}`;
          else if (parts.length > 3) queryStr = parts[0];
          url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(queryStr)}&units=${apiUnit}&appid=${process.env.OPENWEATHER_API_KEY}`;
        }
        
        const wr = await fetch(url).then(r => r.json());
        if (wr.main) {
          weatherData = { temp: Math.round(wr.main.temp), condition: wr.weather[0].main, description: wr.weather[0].description };
        }
      } catch (err) { console.warn('Weather fetch failed for fit check:', err.message); }
    }

    // Feed the user's wardrobe to the AI for swap suggestions
    const userItems = await db.select()
      .from(wardrobeItems)
      .where(eq(wardrobeItems.userId, req.user.id));

    let aiResult;
    try {
      const fileData = await fs.readFile(req.file.path);
      const base64Image = fileData.toString('base64');
      aiResult = await getFitCheckAnalysis(base64Image, weatherData, user.stylePreferences || [], userItems);
    } catch (err) {
      console.error('OpenAI Fit Check failed:', err.message);
      return res.status(500).json({ error: 'AI analysis failed. Please ensure your OpenAI key is valid.' });
    }

    // Process structured swaps
    const recommendedSwaps = [];
    if (aiResult.recommended_swaps && Array.isArray(aiResult.recommended_swaps)) {
      for (const swap of aiResult.recommended_swaps) {
        // AI might return an ID or a description
        const match = userItems.find(i => i.id === swap.swap_with);
        recommendedSwaps.push({
          name: match ? match.name : swap.swap_with,
          imageUrl: match ? match.imageUrl : null,
          reason: swap.reason,
          source: match ? 'From your closet' : 'Style suggestion',
          currentItem: swap.current_item
        });
      }
    }

    // Save fit check to DB
    console.log(`[FitCheck] AI returned score: ${aiResult.score}`);
    const finalScore = (typeof aiResult.score === 'number') ? aiResult.score : 5;

    const [fitCheck] = await db.insert(fitChecks).values({
      userId: req.user.id,
      imageUrl,
      score: finalScore,
      verdict: aiResult.editorial_verdict || aiResult.verdict || "Analysis complete.",
      feedback: {
        analysis: aiResult.analysis || {},
        pros: aiResult.pros || [],
        cons: aiResult.cons || [],
        quickFixes: aiResult.quick_fix_tips || []
      },
      recommendedSwaps,
      weather: {
        temp: weatherData.temp,
        condition: weatherData.condition,
        city: weatherData.city || user.city || 'Unknown'
      },
    }).returning();

    res.status(201).json({
      message: 'Fit check complete',
      fitCheck: {
        ...fitCheck,
        weatherContext: {
          temp: weatherData.temp.toString() + (user.weatherUnit || '°C'),
          condition: weatherData.condition,
          description: weatherData.description
        }
      },
    });
  })
);

// ── Get Fit Check History ──
router.get('/history', authenticate, asyncHandler(async (req, res) => {
  const history = await db.select()
    .from(fitChecks)
    .where(eq(fitChecks.userId, req.user.id))
    .orderBy(desc(fitChecks.createdAt))
    .limit(20);

  res.json({ fitChecks: history });
}));

// ── Get Single Fit Check ──
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const [check] = await db.select()
    .from(fitChecks)
    .where(eq(fitChecks.id, req.params.id))
    .limit(1);

  if (!check || check.userId !== req.user.id) {
    return res.status(404).json({ error: 'Fit check not found' });
  }

  res.json({ fitCheck: check });
}));

export default router;
