// ── Profile Routes ──
import { Router } from 'express';
import { eq } from 'drizzle-orm';
import db from '../db/index.js';
import { users } from '../db/schema.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { upload } from '../config/upload.js';

const router = Router();

// ── Get Profile ──
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const [user] = await db.select({
    id: users.id,
    email: users.email,
    name: users.name,
    gender: users.gender,
    city: users.city,
    weatherUnit: users.weatherUnit,
    stylePreferences: users.stylePreferences,
    avatarUrl: users.avatarUrl,
    onboardingCompleted: users.onboardingCompleted,
    createdAt: users.createdAt,
  })
    .from(users)
    .where(eq(users.id, req.user.id))
    .limit(1);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ user });
}));

// ── Update Profile ──
router.put('/', authenticate, asyncHandler(async (req, res) => {
  const { name, gender, city, weatherUnit, stylePreferences } = req.body;

  const updateData = { updatedAt: new Date() };
  if (name !== undefined) updateData.name = name;
  if (gender !== undefined) updateData.gender = gender;
  if (city !== undefined) updateData.city = city;
  if (weatherUnit !== undefined) updateData.weatherUnit = weatherUnit;
  if (stylePreferences !== undefined) updateData.stylePreferences = stylePreferences;

  const [updated] = await db.update(users)
    .set(updateData)
    .where(eq(users.id, req.user.id))
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      gender: users.gender,
      city: users.city,
      weatherUnit: users.weatherUnit,
      stylePreferences: users.stylePreferences,
      avatarUrl: users.avatarUrl,
      onboardingCompleted: users.onboardingCompleted,
    });

  res.json({ message: 'Profile updated', user: updated });
}));

// ── Upload Avatar ──
router.post('/avatar', authenticate, upload.single('avatar'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const avatarUrl = `/uploads/${req.file.filename}`;

  const [updated] = await db.update(users)
    .set({ avatarUrl, updatedAt: new Date() })
    .where(eq(users.id, req.user.id))
    .returning({ avatarUrl: users.avatarUrl });

  res.json({ message: 'Avatar updated', avatarUrl: updated.avatarUrl });
}));

// ── Complete Onboarding ──
router.post('/complete-onboarding', authenticate, asyncHandler(async (req, res) => {
  const { name, gender, city, weatherUnit, stylePreferences } = req.body;

  const [updated] = await db.update(users)
    .set({
      name: name || undefined,
      gender: gender || undefined,
      city: city || undefined,
      weatherUnit: weatherUnit || '°C',
      stylePreferences: stylePreferences || [],
      onboardingCompleted: true,
      updatedAt: new Date(),
    })
    .where(eq(users.id, req.user.id))
    .returning({
      id: users.id,
      name: users.name,
      gender: users.gender,
      city: users.city,
      weatherUnit: users.weatherUnit,
      stylePreferences: users.stylePreferences,
      onboardingCompleted: users.onboardingCompleted,
    });

  res.json({ message: 'Onboarding completed', user: updated });
}));

export default router;
