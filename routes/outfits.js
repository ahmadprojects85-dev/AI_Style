// ── Outfit Routes ──
import { Router } from 'express';
import { eq, desc } from 'drizzle-orm';
import db from '../db/index.js';
import { outfits, wardrobeItems, users } from '../db/schema.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

import { getDailyOutfitSuggestion } from '../services/ai.js';

// ── Get Daily Outfit Suggestion (AI Powered) ──
router.get('/suggestion', authenticate, asyncHandler(async (req, res) => {
  const occasion = req.query.occasion || 'casual';
  const style = req.query.style || null;

  // Fetch user's wardrobe
  const items = await db.select()
    .from(wardrobeItems)
    .where(eq(wardrobeItems.userId, req.user.id));

  // Fetch user profile
  const [user] = await db.select()
    .from(users)
    .where(eq(users.id, req.user.id))
    .limit(1);

  if (items.length === 0) {
    return res.json({
      message: 'Add some items to your wardrobe first!',
      suggestion: null,
    });
  }

  // Get Live Weather
  let weatherData = { temp: 20, condition: 'Clear', city: user.city || 'Unknown' };
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
        weatherData = { temp: Math.round(wr.main.temp), condition: wr.weather[0].main, city: wr.name };
      }
    } catch (err) { console.warn('Weather fetch failed for suggestion:', err.message); }
  }

  try {
    const aiResult = await getDailyOutfitSuggestion(items, weatherData, user.stylePreferences || [], occasion, style);
    
    // Map AI's structured IDs to actual objects
    const selectedIds = Object.values(aiResult.selected_items || {}).filter(id => id !== null);
    const selectedItems = items.filter(i => selectedIds.includes(i.id));

    const suggestion = {
      title: aiResult.title || 'Your Curated Look',
      vibe: aiResult.overall_vibe,
      reasoning: aiResult.description || 'Perfect for today.',
      styleLogic: aiResult.styling_reasoning || {},
      items: selectedItems,
      backup: aiResult.backup_option,
      limitations: aiResult.wardrobe_limitations,
      weatherContext: {
        city: weatherData.city,
        temp: weatherData.temp.toString() + (user.weatherUnit || '°C'),
        condition: weatherData.condition,
      },
    };

    res.json({ suggestion });
  } catch (err) {
    console.error('OpenAI Suggestion failed:', err.message);
    res.status(500).json({ error: 'AI failed to curate outfit. Please verify your OpenAI key.' });
  }
}));

// ── Save Outfit ──
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { name, description, itemIds, occasion, weather } = req.body;

  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ error: 'Please provide at least one item' });
  }

  const [outfit] = await db.insert(outfits).values({
    userId: req.user.id,
    name: name || 'My Outfit',
    description,
    itemIds,
    occasion,
    weather,
  }).returning();

  res.status(201).json({ message: 'Outfit saved', outfit });
}));

// ── Get Outfit History ──
router.get('/history', authenticate, asyncHandler(async (req, res) => {
  const history = await db.select()
    .from(outfits)
    .where(eq(outfits.userId, req.user.id))
    .orderBy(desc(outfits.createdAt))
    .limit(20);

  res.json({ outfits: history });
}));

// ── Get Single Outfit ──
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const [outfit] = await db.select()
    .from(outfits)
    .where(eq(outfits.id, req.params.id))
    .limit(1);

  if (!outfit || outfit.userId !== req.user.id) {
    return res.status(404).json({ error: 'Outfit not found' });
  }

  // Fetch the actual items
  const items = [];
  if (outfit.itemIds && outfit.itemIds.length > 0) {
    for (const itemId of outfit.itemIds) {
      const [item] = await db.select()
        .from(wardrobeItems)
        .where(eq(wardrobeItems.id, itemId))
        .limit(1);
      if (item) items.push(item);
    }
  }

  res.json({ outfit, items });
}));

// ── Delete Outfit ──
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const [deleted] = await db.delete(outfits)
    .where(eq(outfits.id, req.params.id))
    .returning({ id: outfits.id });

  if (!deleted) {
    return res.status(404).json({ error: 'Outfit not found' });
  }

  res.json({ message: 'Outfit deleted', id: deleted.id });
}));

export default router;
