import { Router } from 'express'
import lessonsController from './controllers/lessonsController'

const router = Router()

router.use('/lessons', lessonsController)

router.get('/status', (req, res) => {
  res.status(200).json('online')
})

export default router
