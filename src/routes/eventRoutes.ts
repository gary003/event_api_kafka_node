import express from 'express'

const router = express.Router()

router.route('/').get((_, res) => {
  res.status(200).json({ data: 2 })
})

export default router
