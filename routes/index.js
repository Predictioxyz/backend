const Router = require('express')
const router = new Router()

const eventRouter = require('./eventRouter')
const userRouter = require('./userRouter')
const positionRouter = require('./positionRouter')

router.use('/events', eventRouter)
router.use('/users', userRouter)
router.use('/positions', positionRouter)

module.exports = router