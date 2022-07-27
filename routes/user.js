const express = require('express');

const router= express.Router();

const passport = require('passport');

const userController = require('../controllers/user_controller');
// Sign up and sign in routes
router.get('/sign-up', userController.signup);
router.post('/create', userController.create);
router.get('/sign-in', userController.signIn);
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/sign-in'},
),userController.createSession);
// profile
router.get('/profile',passport.checkAuthentication, userController.profile);
// Sign out 
router.get('/sign-out',userController.destroySession);

// google sign in routes
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),userController.createSession);

//forgot password form
router.get('/forgot-password',userController.forgotForm);
router.post('/forgot',userController.sendPassword);

// update passwrod
router.get('/update-password',passport.checkAuthentication,userController.updatePasswordForm);
router.post('/update/:id',passport.checkAuthentication,userController.updatePassword);
// reset password
router.get('/reset/:id/:token', userController.resetPasswordform);
router.post('/reset/:id/:token',userController.resetPasswordUpdated);
module.exports = router;
