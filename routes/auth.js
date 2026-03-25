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
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const router = Router();

// ── Register ──
router.post('/register',
  validate({
    email:    { required: true, type: 'email' },
    password: { required: true, minLength: 6, maxLength: 100 },
    name:     { required: true, minLength: 1, maxLength: 100 },
  }),
  asyncHandler(async (req, res) => {
    const { email, password, name, gender, city, weatherUnit, stylePreferences } = req.body;

    // Check if user exists
    const existing = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({ error: 'User already exists', message: 'An account with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const [newUser] = await db.insert(users).values({
      email: email.toLowerCase(),
      passwordHash,
      name,
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

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: newUser,
    });
  })
);

// ── Google Auth (Login or initiate Register) ──
router.post('/google',
  validate({
    idToken: { required: true },
  }),
  asyncHandler(async (req, res) => {
    const { idToken } = req.body;

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const email = payload.email;
      const name = payload.name;
      const avatarUrl = payload.picture;

      // Check if user exists
      const [user] = await db.select()
        .from(users)
        .where(eq(users.email, email.toLowerCase()))
        .limit(1);

      if (user) {
        // User exists -> Log them in!
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        return res.json({
          message: 'Google login successful',
          isNewUser: false,
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            city: user.city,
            gender: user.gender,
            stylePreferences: user.stylePreferences,
            avatarUrl: user.avatarUrl,
          },
        });
      }

      // User does not exist -> Tell frontend to gather Onboarding info
      res.json({
        message: 'New Google user, requires onboarding',
        isNewUser: true,
        email,
        name,
        avatarUrl,
      });
    } catch (err) {
      console.error('Google token verification failed:', err);
      res.status(401).json({ error: 'Invalid Google token', message: 'Authentication failed' });
    }
  })
);

// ── Login ──
router.post('/login',
  validate({
    email:    { required: true, type: 'email' },
    password: { required: true },
  }),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials', message: 'Email or password is incorrect' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials', message: 'Email or password is incorrect' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

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
