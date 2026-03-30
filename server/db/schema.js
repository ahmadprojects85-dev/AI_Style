// ── Database Schema (Drizzle ORM) ──
import { pgTable, uuid, varchar, text, timestamp, integer, boolean, jsonb, pgEnum } from 'drizzle-orm/pg-core';

// ── Enums ──
export const genderEnum = pgEnum('gender', ['women', 'men', 'non-binary', 'prefer-not-to-say']);
export const seasonEnum = pgEnum('season', ['spring', 'summer', 'fall', 'winter']);
export const categoryEnum = pgEnum('category', ['tops', 'outerwear', 'bottoms', 'shoes', 'accessories']);

// ══════════════════════════════════════
// USERS
// ══════════════════════════════════════
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: varchar('name', { length: 100 }),
  gender: genderEnum('gender'),
  city: varchar('city', { length: 100 }),
  weatherUnit: varchar('weather_unit', { length: 5 }).default('°C'),
  stylePreferences: jsonb('style_preferences').default([]),  // e.g. ["Old Money", "Minimalist"]
  avatarUrl: text('avatar_url'),
  onboardingCompleted: boolean('onboarding_completed').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ══════════════════════════════════════
// WARDROBE ITEMS
// ══════════════════════════════════════
export const wardrobeItems = pgTable('wardrobe_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 200 }).notNull(),
  category: categoryEnum('category').notNull(),
  brand: varchar('brand', { length: 100 }),
  colors: jsonb('colors').default([]),          // e.g. ["#C4956A", "#E8D5B7"]
  colorNames: jsonb('color_names').default([]), // e.g. ["Camel", "Cream"]
  seasons: jsonb('seasons').default([]),        // e.g. ["fall", "winter"]
  imageUrl: text('image_url'),
  aiColorAnalysis: jsonb('ai_color_analysis'),  // Raw AI response
  isFavorite: boolean('is_favorite').default(false),
  timesWorn: integer('times_worn').default(0),
  lastWornAt: timestamp('last_worn_at'),
  additionalImageUrls: jsonb('additional_image_urls').default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ══════════════════════════════════════
// OUTFITS (saved outfit combinations)
// ══════════════════════════════════════
export const outfits = pgTable('outfits', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 200 }),
  description: text('description'),
  itemIds: jsonb('item_ids').default([]),       // Array of wardrobe_item UUIDs
  imageUrl: text('image_url'),                  // Flat-lay / combined image
  occasion: varchar('occasion', { length: 100 }),
  weather: jsonb('weather'),                    // { temp, condition, city }
  isAiGenerated: boolean('is_ai_generated').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ══════════════════════════════════════
// FIT CHECKS (AI outfit analysis)
// ══════════════════════════════════════
export const fitChecks = pgTable('fit_checks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url'),
  score: integer('score'),                      // 1-10
  verdict: text('verdict'),                     // AI editorial text
  feedback: jsonb('feedback'),                  // Detailed AI feedback
  recommendedSwaps: jsonb('recommended_swaps'), // Array of swap suggestions
  weather: jsonb('weather'),                    // { temp, condition, city }
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ══════════════════════════════════════
// STYLE INSIGHTS (AI-generated tips)
// ══════════════════════════════════════
export const styleInsights = pgTable('style_insights', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(), // 'tip', 'trend', 'color', 'combination'
  title: varchar('title', { length: 200 }),
  content: text('content').notNull(),
  icon: varchar('icon', { length: 50 }),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
