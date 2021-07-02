import { Router } from 'express'
import { loadLessons } from '../services/lessonLoader'
import { loadStoryboards } from '../services/loadStoryboards'
import logger from '../util/logger'

const router = Router()

router.get('/', (req, res) => {
  const lessons = loadLessons()
  logger.debug('lessons:')//, lessons)
  res.status(200).json(lessons)
})
router.get('/storyboards', (req, res) => {
  const sbs = loadStoryboards()
  // logger.debug('storyboards:', sbs)
  res.status(200).json(sbs)
})

export default router
