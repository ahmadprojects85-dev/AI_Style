// ── Wardrobe Routes ──
import { Router } from 'express';
import { eq, and, desc, sql } from 'drizzle-orm';
import db from '../db/index.js';
import { wardrobeItems } from '../db/schema.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { upload } from '../config/upload.js';

const router = Router();

// ── Get All Items ──
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { category, season, favorite, sort } = req.query;

  let query = db.select().from(wardrobeItems).where(eq(wardrobeItems.userId, req.user.id));

  // Filter by category
  if (category && category !== 'all') {
    query = db.select().from(wardrobeItems).where(
      and(eq(wardrobeItems.userId, req.user.id), eq(wardrobeItems.category, category))
    );
  }

  // Filter by favorite
  if (favorite === 'true') {
    query = db.select().from(wardrobeItems).where(
      and(eq(wardrobeItems.userId, req.user.id), eq(wardrobeItems.isFavorite, true))
    );
  }

  const items = await query.orderBy(desc(wardrobeItems.createdAt));

  // Filter by season in memory (JSONB)
  let filteredItems = items;
  if (season) {
    filteredItems = items.filter(item => item.seasons && item.seasons.includes(season));
  }

  res.json({
    items: filteredItems,
    total: filteredItems.length,
  });
}));

// ── Get Single Item ──
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const [item] = await db.select()
    .from(wardrobeItems)
    .where(and(eq(wardrobeItems.id, req.params.id), eq(wardrobeItems.userId, req.user.id)))
    .limit(1);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.json({ item });
}));

import fs from 'fs/promises';
import { analyzeWardrobeImage } from '../services/ai.js';

// ── Add New Item ──
router.post('/',
  authenticate,
  upload.array('images', 5),
  asyncHandler(async (req, res) => {
    let { name, category, brand, colors, colorNames, seasons } = req.body;
    let aiColorAnalysis = null;
    
    const files = req.files || [];
    const imageUrl = files.length > 0 ? `/uploads/${files[0].filename}` : null;
    const additionalImageUrls = files.length > 1 ? files.slice(1).map(f => `/uploads/${f.filename}`) : [];

    if (files.length > 0) {
      try {
        const base64Images = await Promise.all(
          files.map(async (file) => {
            const data = await fs.readFile(file.path);
            return data.toString('base64');
          })
        );
        
        const aiData = await analyzeWardrobeImage(base64Images);
        
        name = name || aiData.name;
        category = category || aiData.category;
        
        // Extract rich color data
        if (aiData.primary_color) {
          colors = [aiData.primary_color.hex];
          colorNames = [aiData.primary_color.name];
          if (aiData.secondary_colors && Array.isArray(aiData.secondary_colors)) {
            aiData.secondary_colors.forEach(c => {
              colors.push(c.hex);
              colorNames.push(c.name);
            });
          }
        }

        seasons = aiData.seasons || [];
        aiColorAnalysis = aiData;
        
      } catch (err) {
        console.error('OpenAI Multi-Angle Analysis failed:', err.message);
      }
    }

    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }

    const [newItem] = await db.insert(wardrobeItems).values({
      userId: req.user.id,
      name,
      category,
      brand: brand || null,
      colors: colors ? (typeof colors === 'string' ? JSON.parse(colors) : colors) : [],
      colorNames: colorNames ? (typeof colorNames === 'string' ? JSON.parse(colorNames) : colorNames) : [],
      seasons: seasons ? (typeof seasons === 'string' ? JSON.parse(seasons) : seasons) : [],
      imageUrl,
      additionalImageUrls,
      aiColorAnalysis,
    }).returning();

    res.status(201).json({ message: 'Item added with multi-angle support', item: newItem });
  })
);

// ── Update Item ──
router.put('/:id',
  authenticate,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    const { name, category, brand, colors, colorNames, seasons, isFavorite } = req.body;

    // Verify ownership
    const [existing] = await db.select({ id: wardrobeItems.id })
      .from(wardrobeItems)
      .where(and(eq(wardrobeItems.id, req.params.id), eq(wardrobeItems.userId, req.user.id)))
      .limit(1);

    if (!existing) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const updateData = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (brand !== undefined) updateData.brand = brand;
    if (colors !== undefined) updateData.colors = typeof colors === 'string' ? JSON.parse(colors) : colors;
    if (colorNames !== undefined) updateData.colorNames = typeof colorNames === 'string' ? JSON.parse(colorNames) : colorNames;
    if (seasons !== undefined) updateData.seasons = typeof seasons === 'string' ? JSON.parse(seasons) : seasons;
    if (isFavorite !== undefined) updateData.isFavorite = isFavorite === 'true' || isFavorite === true;
    if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;

    const [updated] = await db.update(wardrobeItems)
      .set(updateData)
      .where(eq(wardrobeItems.id, req.params.id))
      .returning();

    res.json({ message: 'Item updated', item: updated });
  })
);

// ── Delete Item ──
router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const [deleted] = await db.delete(wardrobeItems)
    .where(and(eq(wardrobeItems.id, req.params.id), eq(wardrobeItems.userId, req.user.id)))
    .returning({ id: wardrobeItems.id });

  if (!deleted) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.json({ message: 'Item removed from wardrobe', id: deleted.id });
}));

// ── Toggle Favorite ──
router.patch('/:id/favorite', authenticate, asyncHandler(async (req, res) => {
  const [item] = await db.select({ isFavorite: wardrobeItems.isFavorite })
    .from(wardrobeItems)
    .where(and(eq(wardrobeItems.id, req.params.id), eq(wardrobeItems.userId, req.user.id)))
    .limit(1);

  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const [updated] = await db.update(wardrobeItems)
    .set({ isFavorite: !item.isFavorite, updatedAt: new Date() })
    .where(eq(wardrobeItems.id, req.params.id))
    .returning();

  res.json({ message: item.isFavorite ? 'Removed from favorites' : 'Added to favorites', item: updated });
}));

// ── Record Wear ──
router.patch('/:id/wear', authenticate, asyncHandler(async (req, res) => {
  const [updated] = await db.update(wardrobeItems)
    .set({
      timesWorn: sql`${wardrobeItems.timesWorn} + 1`,
      lastWornAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(wardrobeItems.id, req.params.id), eq(wardrobeItems.userId, req.user.id)))
    .returning();

  if (!updated) {
    return res.status(404).json({ error: 'Item not found' });
  }

  res.json({ message: 'Wear recorded', item: updated });
}));

// ── Wardrobe Stats ──
router.get('/stats/summary', authenticate, asyncHandler(async (req, res) => {
  const items = await db.select()
    .from(wardrobeItems)
    .where(eq(wardrobeItems.userId, req.user.id));

  const totalItems = items.length;
  const categories = {};
  let mostWornItem = null;
  let maxWorn = 0;

  items.forEach(item => {
    categories[item.category] = (categories[item.category] || 0) + 1;
    if (item.timesWorn > maxWorn) {
      maxWorn = item.timesWorn;
      mostWornItem = item.name;
    }
  });

  res.json({
    totalItems,
    categories,
    mostWornItem: mostWornItem || 'None yet',
    favoriteCount: items.filter(i => i.isFavorite).length,
  });
}));

export default router;
