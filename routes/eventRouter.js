const Router = require('express')
const router = new Router
const eventController = require('../controllers/eventController')

router.post('/create', eventController.create)
router.post('/settle', eventController.settle)
router.post('/find/one', eventController.findOne)
router.post('/find/multiple', eventController.findMultiple)

module.exports = router