import winston from 'winston';

const { combine, timestamp, json, printf, colorize, align } = winston.format;

// Security-focused JSON logging
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS A' }),
    json()
  ),
  transports: [
    // Write all core logs with level `info` and below to `combined.log`
    new winston.transports.File({ filename: 'logs/combined.log' }),
    // Write all security warnings and errors to `security.log`
    new winston.transports.File({ filename: 'logs/security.log', level: 'warn' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize({ all: true }),
      align(),
      printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    )
  }));
}

export const logSecurityEvent = (type, req, payload = {}) => {
  logger.warn('SECURITY_EVENT', {
    type,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
    ...payload
  });
};
