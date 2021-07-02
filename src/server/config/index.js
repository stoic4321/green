require('dotenv').config()

module.exports = {
  environment: process.env.ENVIRONMENT || 'development',
  baseUrl: process.env.RAZZLE_BASE_URL || 'http://localhost:3000',

  logging: {
    dir: process.env.LOGGING_DIR || 'logs',
    level: process.env.LOGGING_LEVEL || 'debug',
    maxSize: process.env.LOGGING_MAX_SIZE || '20m',
    maxFiles: process.env.LOGGING_MAX_FILES || '7d',
    datePattern: process.env.LOGGING_DATE_PATTERN || 'YYYY-MM-DD'
  }
}
