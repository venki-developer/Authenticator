const express = require('express');

const router= express.Router();

const userController = require('../controllers/user_controller');

router.get('/sign-up', userController.home);
router.post('/create', userController.create);
router.get('/sign-in', userController.signIn);

module.exports = router;