import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config({ override: true });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * SHARED MASTER STYLING LOGIC (The "Style Brain")
 * This foundation ensures consistent fashion-literate behavior across all AI tasks.
 */
const MASTER_STYLE_BRAIN = `
You are an elite AI fashion stylist, wardrobe analyst, and outfit critic. 
Your job is to think like a real professional stylist.

You evaluate clothing and outfits using these dimensions:
1. COLOR THEORY: Identify dominant/accent colors, undertones, and intentional palettes (monochrome, tonal, high-contrast).
2. SILHOUETTE & PROPORTION: Balance structure, volume, and rhythm.
3. OCCASION MATCHING: Strictly honor dress expectations for Work, Casual, Date, and Gym.
4. WEATHER INTELLIGENCE: Practicality is key. No impractical fabrics/footwear for rain or extreme temps.
5. STYLE IDENTITY: Respect Minimal, Old Money, Streetwear, etc.
6. GARMENT COMPATIBILITY: Texture, weight, and formality harmony.
7. CRITICAL STANDARDS: Be tasteful and selective. Do not praise weak looks. Explain WHY a look works using fashion logic.
8. SCORING RIGOR: Use the full 1-10 scale. Be a tough editorial critic.
   - 1-3: "Fashion Disaster" (Significant clashes, completely inappropriate for weather/occasion).
   - 4-6: "Needs Work" (Basic, uninspired, or has 1-2 functional/styling flaws).
   - 7-8: "Stylish" (Well-coordinated, matches style identity, weather-appropriate).
   - 9-10: "Editorial Excellence" (Perfect proportions, high-end execution, impeccable harmony).
`;

/**
 * 1. WARDROBE ANALYZER
 * Extracts rich metadata for single item uploads.
 */
export async function analyzeWardrobeImage(base64Images) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OpenAI API key missing');

  // Ensure it's an array
  const images = Array.isArray(base64Images) ? base64Images : [base64Images];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `${MASTER_STYLE_BRAIN}
        
        TASK: Analyze the provided images of ONE clothing item. 
        Note: The user may provide multiple angles (front, back, tag, texture). Use all views to be as accurate as possible.
        
        Return ONLY a strict JSON object with this exact schema:
        {
          "name": "string",
          "category": "tops | outerwear | bottoms | shoes | accessories",
          "sub_category": "string",
          "primary_color": { "name": "string", "hex": "string", "tone": "warm|cool|neutral", "depth": "light|medium|dark", "intensity": "muted|balanced|vibrant" },
          "secondary_colors": [{ "name": "string", "hex": "string" }],
          "pattern": "solid|striped|plaid|graphic|textured|color-block|printed|other",
          "material_guess": "string",
          "fit_type": "slim|regular|relaxed|oversized|structured|unknown",
          "formality": "casual|smart casual|polished|formal|sporty",
          "style_tags": ["string"],
          "best_for_occasions": ["Work", "Casual", "Date", "Gym"],
          "best_for_weather": { "temperature_range_c": "string", "weather_conditions": ["Sunny", "Cloudy", "Rainy", "Cold", "Hot"] },
          "seasons": ["Spring", "Summer", "Fall", "Winter"],
          "layering_role": "base layer|mid layer|outer layer|standalone",
          "color_pairing_notes": { "works_well_with": ["string"], "avoid_if_possible_with": ["string"] },
          "confidence": 0.0,
          "notes": "string"
        }`
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Analyze this clothing item from all provided angles.' },
          ...images.map(img => ({
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${img}` }
          }))
        ]
      }
    ],
    max_tokens: 500,
    temperature: 0.2,
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0].message.content);
}

/**
 * 2. DAILY STYLIST (WITH SCORING)
 * Curates a full outfit from the wardrobe based on context.
 */
export async function getDailyOutfitSuggestion(wardrobeData, weather, stylePreferences, occasion, dynamicStyle = null) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OpenAI API key missing');

  // If a dynamic style is provided (from the new homepage selector), it overrides profile preferences.
  const styleToUse = dynamicStyle || stylePreferences;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `${MASTER_STYLE_BRAIN}
        
        TASK: Create the best possible outfit using ONLY items in the user's real wardrobe.
        
        INPUTS:
        - Weather: ${weather.temp}°C, ${weather.condition} in ${weather.city}
        - Occasion: ${occasion}
        - Style requirement (MANDATORY): ${Array.isArray(styleToUse) ? styleToUse.join(', ') : styleToUse}
        
        - Full wardrobe items: ${JSON.stringify(wardrobeData.map(i => ({ 
            id: i.id, 
            name: i.name, 
            category: i.category,
            metadata: i.aiColorAnalysis 
          })))}

        STYLING PROCESS:
        1. Eliminate items that fail occasion/weather suitability.
        2. STRICT RULE: Suggest EXACTLY ONE item per category. NEVER suggest two items of the same type (e.g., do NOT suggest a shirt and a hoodie together). 
        3. NO LAYERING: Even if the weather is cold, choose ONE appropriate warm top instead of layering a shirt under a hoodie. The user wants a single-item representation for each body part.
        4. Internally score combinations based on: Occasion match (30), Weather (25), Color harmony (20), Style match (15), Proportion (10).
        5. Select the strongest total score.

        Return ONLY a strict JSON object with this exact schema:
        {
          "title": "string",
          "overall_vibe": "string",
          "selected_items": {
            "top": "id", "bottom": "id", "shoes": "id", "accessory": "id|null"
          },
          "styling_reasoning": {
            "color_logic": "string", "weather_logic": "string", "occasion_logic": "string", "style_logic": "string", "silhouette_logic": "string"
          },
          "description": "Stylish, encouraging paragraph.",
          "confidence": 0.0,
          "backup_option": { "top": "id", "bottom": "id", "why_this_is_second_best": "string" },
          "wardrobe_limitations": "string"
        }`
      },
      {
        role: 'user',
        content: `Suggest my best outfit for a ${occasion} setting today.`
      }
    ],
    max_tokens: 800,
    temperature: 0.7,
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0].message.content);
}

/**
 * 3. FIT CHECK (EDITORIAL CRITIQUE)
 * Analyzes a mirror selfie against the user's goals.
 */
export async function getFitCheckAnalysis(base64Image, weather, stylePreferences, wardrobeData = []) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OpenAI API key missing');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `${MASTER_STYLE_BRAIN}
        
        TASK: Analyze the user's mirror selfie outfit with a sharp editorial eye. Be honest but constructive.
        
        INPUTS:
        - Weather: ${weather.temp}°C, ${weather.condition}
        - Style preferences: ${JSON.stringify(stylePreferences)}
        - User wardrobe: ${JSON.stringify(wardrobeData.map(i => ({ id: i.id, name: i.name, category: i.category })))}

        Return ONLY a strict JSON object with this exact schema:
        {
          "score": 0, // 1-10
          "editorial_verdict": "string",
          "analysis": { "color": "string", "silhouette": "string", "weather": "string", "occasion": "string", "style_alignment": "string", "overall_polish": "string" },
          "pros": ["string"],
          "cons": ["string"],
          "recommended_swaps": [{ "current_item": "description", "swap_with": "wardrobe_item_id", "reason": "string" }],
          "quick_fix_tips": ["string"],
          "confidence": 0.0
        }`
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Critique my outfit. Be sharp and fashion-aware.' },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
        ]
      }
    ],
    max_tokens: 800,
    temperature: 0.8,
    response_format: { type: 'json_object' }
  });

  return JSON.parse(response.choices[0].message.content);
}

/**
 * 4. STYLIST CHAT (Contextual Look Q&A)
 * Allows the user to chat with the AI about a specific suggested outfit.
 */
export async function chatWithStylist(userMessage, conversationHistory, outfitContext) {
  if (!process.env.OPENAI_API_KEY) throw new Error('OpenAI API key missing');
  console.log('[chatWithStylist] Call for:', outfitContext?.title);

  const systemPrompt = `${MASTER_STYLE_BRAIN}

TASK: You are having a conversation with the user about a specific outfit you curated for them.
Be warm, knowledgeable, and concise. Answer like a real personal stylist would — confident but approachable.
Keep responses to 2-3 short paragraphs max. Use fashion terminology naturally.

OUTFIT CONTEXT:
- Look Title: ${outfitContext.title || 'Curated Look'}
- Styling Reasoning: ${outfitContext.reasoning || 'N/A'}
- Items in this look: ${JSON.stringify(outfitContext.items?.map(i => ({ name: i.name, category: i.category })) || [])}
- Weather: ${outfitContext.weather || 'N/A'}
- Occasion: ${outfitContext.occasion || 'N/A'}
- Style: ${outfitContext.style || 'N/A'}

Respond naturally in plain text. Do NOT return JSON. Be conversational and helpful.`;

  // Build messages array: system + history + new user message
  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      max_tokens: 400,
      temperature: 0.7,
    });

    const reply = response.choices[0].message.content;
    console.log('[chatWithStylist] Success. Reply length:', reply.length);
    return reply;
  } catch (err) {
    console.error('[chatWithStylist] Error during completion:', err.message);
    if (err.response) {
      console.error('[chatWithStylist] API Status:', err.response.status);
      console.error('[chatWithStylist] API Error Data:', JSON.stringify(err.response.data));
    }
    throw err;
  }
}
