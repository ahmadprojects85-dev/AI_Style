// ── Auth Routes ──
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import db from '../db/index.js';
import { users } from '../db/schema.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { logSecurityEvent } from '../utils/logger.js';
const router = Router();

// ── Register ──
router.post('/register',
  validate({
    username: { required: true, minLength: 3, maxLength: 50 },
    email:    { required: true, type: 'email' },
    password: { required: true, minLength: 6, maxLength: 100 },
  }),
  asyncHandler(async (req, res) => {
    const { username, email, password, gender, city, weatherUnit, stylePreferences } = req.body;

    // Check if user exists (email or username)
    const existing = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({ error: 'User already exists', message: 'An account with this email already exists' });
    }

    const existingUsername = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.username, username.toLowerCase()))
      .limit(1);

    if (existingUsername.length > 0) {
      return res.status(409).json({ error: 'Username taken', message: 'This username is already occupied' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const [newUser] = await db.insert(users).values({
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      passwordHash,
      name: null,
      gender: gender || null,
      city: city || null,
      weatherUnit: weatherUnit || '°C',
      stylePreferences: stylePreferences || [],
      onboardingCompleted: !!stylePreferences?.length,
    }).returning({
      id: users.id,
      email: users.email,
      name: users.name,
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    logSecurityEvent('REGISTRATION', req, { userId: newUser.id, email: newUser.email });

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: newUser,
    });
  })
);

// ── Removed Google Auth ──

// ── Login ──
router.post('/login',
  validate({
    identifier: { required: true, minLength: 3 }, // email OR username
    password:   { required: true },
  }),
  asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;

    const isEmail = identifier.includes('@');
    
    // Find user
    const [user] = await db.select()
      .from(users)
      .where(isEmail ? eq(users.email, identifier.toLowerCase()) : eq(users.username, identifier.toLowerCase()))
      .limit(1);

    if (!user) {
      logSecurityEvent('FAILED_LOGIN', req, { user: identifier, reason: 'unregistered_identifier' });
      return res.status(401).json({ error: 'Invalid credentials', message: 'Email or password is incorrect' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      logSecurityEvent('FAILED_LOGIN', req, { user: identifier, reason: 'invalid_password' });
      return res.status(401).json({ error: 'Invalid credentials', message: 'Email or password is incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    logSecurityEvent('SUCCESSFUL_LOGIN', req, { userId: user.id, email: user.email });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        city: user.city,
        gender: user.gender,
        weatherUnit: user.weatherUnit,
        stylePreferences: user.stylePreferences,
        avatarUrl: user.avatarUrl,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  })
);

// ── Get Current User ──
router.get('/me', authenticate, asyncHandler(async (req, res) => {
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

export default router;
