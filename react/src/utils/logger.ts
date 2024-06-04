// src/utils/logger.ts
let logger: any;

if (typeof window === 'undefined') {
  const winston = require('winston');
  logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console()
    ]
  });
} else {
  logger = {
    info: () => {},
    error: () => {},
  };
}

export default logger;
