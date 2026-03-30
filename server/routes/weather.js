import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/test', (req, res) => {
  res.json({ 
    key_exists: !!process.env.OPENWEATHER_API_KEY, 
    key_prefix: process.env.OPENWEATHER_API_KEY?.substring(0, 5) 
  });
});

// GET /api/weather/search
// Query params: q (string query like "Lon")
router.get('/search', authenticate, asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json([]);

  const API_KEY = process.env.OPENWEATHER_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'OpenWeather API Key is not configured' });
  }

  try {
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) throw new Error(data.message);

    const cities = data.map(c => ({
      name: c.name,
      state: c.state,
      country: c.country,
      lat: c.lat,
      lon: c.lon,
      label: `${c.name}${c.state ? ', ' + c.state : ''}, ${c.country}`,
      id: `${c.lat},${c.lon}`
    }));

    res.json(cities);
  } catch (err) {
    console.error('City search failed:', err);
    res.status(500).json({ error: 'Failed to search cities' });
  }
}));

// GET /api/weather
// Query params: city (string), unit (C or F)
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { city, unit } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  // Convert internal unit notation (°C / °F) to OpenWeather format (metric / imperial)
  // Default to metric if not specified
  const apiUnit = unit && unit.includes('F') ? 'imperial' : 'metric';
  
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'OpenWeather API Key is not configured' });
  }

  try {
    let url;
    if (city.includes('|')) {
      const [coords] = city.split('|');
      const [lat, lon] = coords.split(',');
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${apiUnit}&appid=${API_KEY}`;
    } else {
      let queryStr = city;
      const parts = city.split(',').map(p => p.trim());
      if (parts.length === 3) {
        queryStr = `${parts[0]},${parts[2]}`;
      } else if (parts.length > 3) {
        queryStr = parts[0];
      }
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(queryStr)}&units=${apiUnit}&appid=${API_KEY}`;
    }
    
    // Using native fetch
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error('OpenWeather API Error:', data);
      return res.status(response.status).json({ error: 'Failed to fetch weather', details: data.message });
    }

    res.json({
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main, 
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      city: data.name
    });
  } catch (err) {
    console.error('Weather fetch failed:', err);
    res.status(500).json({ error: 'Internal server error while fetching weather.' });
  }
}));

// GET /api/weather/forecast
// Query params: city (string), unit (C or F)
router.get('/forecast', authenticate, asyncHandler(async (req, res) => {
  const { city, unit } = req.query;
  if (!city) return res.status(400).json({ error: 'City is required' });

  const apiUnit = unit && unit.includes('F') ? 'imperial' : 'metric';
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: 'OpenWeather API Key is not configured' });

  try {
    let url;
    if (city.includes('|')) {
      const [coords] = city.split('|');
      const [lat, lon] = coords.split(',');
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${apiUnit}&appid=${API_KEY}`;
    } else {
      let queryStr = city;
      const parts = city.split(',').map(p => p.trim());
      if (parts.length === 3) queryStr = `${parts[0]},${parts[2]}`;
      else if (parts.length > 3) queryStr = parts[0];
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(queryStr)}&units=${apiUnit}&appid=${API_KEY}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: 'Failed to fetch forecast', details: data.message });

    // Process forecast data to get daily summaries
    const dailyForecasts = [];
    const seenDays = new Set();
    const todayStr = new Date().toISOString().split('T')[0];

    for (const item of data.list) {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toISOString().split('T')[0];

      // Skip today or already processed days, limit to 3 days
      if (dateStr === todayStr || seenDays.has(dateStr) || dailyForecasts.length >= 3) continue;

      seenDays.add(dateStr);
      dailyForecasts.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        temp: Math.round(item.main.temp),
        condition: item.weather[0].main,
        icon: item.weather[0].icon
      });
    }

    res.json({ forecasts: dailyForecasts });
  } catch (err) {
    console.error('Forecast fetch failed:', err);
    res.status(500).json({ error: 'Internal server error while fetching forecast.' });
  }
}));

export default router;
