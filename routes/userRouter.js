const Router = require('express')
const router = new Router
const userController = require('../controllers/userController')

router.post('/connect', userController.connect)
router.post('/check', userController.check)
router.post('/addcard', userController.addCard)
router.post('/removecard', userController.removeCard)
router.post('/showcards', userController.showCards)

module.exports = router