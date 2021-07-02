import { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import fs from 'fs'
import config from '../config'

const { combine, colorize, splat, printf, timestamp } = format
const { environment, logging } = config

const keysToFilter = ['password', 'encrypted_password']

const formatter = printf((info) => {
  const { level, message, timestamp: ts, ...restMeta } = info
  let meta
  if (message == 'ev:'){
    meta = Object.values(restMeta).join('')
  }else {
    meta =
    restMeta && Object.keys(restMeta).length
    ? JSON.stringify(restMeta, (key, value) => (keysToFilter.includes(key) ? '******' : value), 2)
    : restMeta instanceof Object
    ? ''
    : restMeta
  }
  return `[ ${ts} ] - [ ${level} ] ${message} ${meta}`
})

if (!fs.existsSync(logging.dir)) {
  fs.mkdirSync(logging.dir)
}

let trans = []

if (environment === 'development') {
  trans = [
    new transports.Console({
      level: logging.level
    })
  ]
}

if (environment === 'test') {
  trans = [
    new transports.Console({
      level: 'error'
    })
  ]
}

if (environment === 'production') {
  trans = [
    ...trans,
    new DailyRotateFile({
      level: logging.level,
      maxSize: logging.maxSize,
      maxFiles: logging.maxFiles,
      datePattern: logging.datePattern,
      zippedArchive: true,
      filename: `${logging.dir}/info-%DATE%.log`
    })
  ]
}
const logger = createLogger({
  format: combine(splat(), colorize(), timestamp(), formatter),
  transports: trans
})

export default logger
