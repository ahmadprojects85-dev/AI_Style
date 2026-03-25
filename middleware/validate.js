// ── Validation Middleware ──

export function validate(schema) {
  return (req, res, next) => {
    const errors = [];
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];
      
      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push({ field, message: `${field} is required` });
        continue;
      }

      if (value === undefined || value === null) continue;

      if (rules.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.push({ field, message: 'Invalid email format' });
      }

      if (rules.minLength && value.length < rules.minLength) {
        errors.push({ field, message: `${field} must be at least ${rules.minLength} characters` });
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push({ field, message: `${field} must be at most ${rules.maxLength} characters` });
      }

      if (rules.enum && !rules.enum.includes(value)) {
        errors.push({ field, message: `${field} must be one of: ${rules.enum.join(', ')}` });
      }

      if (rules.isArray && !Array.isArray(value)) {
        errors.push({ field, message: `${field} must be an array` });
      }

      if (rules.isArray && Array.isArray(value) && rules.maxItems && value.length > rules.maxItems) {
        errors.push({ field, message: `${field} can have at most ${rules.maxItems} items` });
      }
    }

    if (errors.length > 0) {
      const err = new Error('Validation failed');
      err.name = 'ValidationError';
      err.details = errors;
      return next(err);
    }

    next();
  };
}
