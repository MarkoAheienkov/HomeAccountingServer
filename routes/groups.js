const {Router} = require('express');

const groupsController = require('../controls/groups');

const isAuth = require('../middlewares/isAuth');

const {postGroupValidation, postAddUserValidation} = require('../helpers/validation');

const router =  Router();

router.get('/', isAuth, groupsController.getGroups);

router.get('/:id', isAuth, groupsController.getGroup);

router.post('/create', isAuth, postGroupValidation, groupsController.postCreateGroup);

router.post('/addUser', isAuth, postAddUserValidation, groupsController.postAddUser);

module.exports = router;
