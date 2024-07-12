const router = require('express').Router();
const userController = require('../controllers/userControllers')



router.post('/create', userController.createUser)


router.post('/login', userController.loginUser)

// current user
router.get('/current', userController.getCurrentUser)

router.post('/token', userController.getToken)






module.exports = router