const {Router} = require('express');

const authController = require('../controls/auth');

const {signInValidation, signUpValidation} = require('../helpers/validation');

const router = Router();

router.post('/sign-in', signInValidation, authController.signIn);

router.post('/sign-up', signUpValidation, authController.signUp);

module.exports = router;
