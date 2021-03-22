const {Router} = require('express');
const isAuth = require('../middlewares/isAuth');
const ratesController = require('../controls/rates');
const {postAddRateValidation} = require('../helpers/validation');
const router = Router();

router.get('/', ratesController.getAllRates);

router.post('/', isAuth, ratesController.postCreateRate);

module.exports = router;
