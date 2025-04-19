const Router = require('express')
const router = new Router
const positionController = require('../controllers/positionController')

router.post('/open', positionController.open)
router.post('/close', positionController.close)
router.post('/fetch', positionController.fetch)
router.post('/withdraw', positionController.withdraw)

module.exports = router