'use strict';

import winston from 'winston';

export default new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: (process.env.NODE_ENV === 'production') ? 'info' : 'debug',
      timestamp: true,
      stderrLevels: ['error'],
      colorize: true
    })
  ]
});
