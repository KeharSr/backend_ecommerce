const router = require('express').Router();
const userController = require('../controllers/userControllers')



router.post('/create', userController.createUser)


router.post('/login', userController.loginUser)

// current user
router.get('/current', userController.getCurrentUser)

router.post('/token', userController.getToken)

// forgot password
router.post('/forgot_password', userController.forgotPassword);

// verify otp and reset password
router.post('/verify_otp', userController.verifyOtpAndResetPassword);






module.exports = router