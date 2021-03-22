const {Router} = require('express');
const router = Router();

const recordsController = require('../controls/records');
const {postAddRecordValidation} = require('../helpers/validation');
const isAuth = require('../middlewares/isAuth');

router.post('/', isAuth, postAddRecordValidation, recordsController.postAddRecord);

module.exports = router;
