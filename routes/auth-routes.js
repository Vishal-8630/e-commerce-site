const express = require('express');

const authController = require('../controllers/auth-controller');

const router = express.Router();

// This is for serving the signup page 
router.get('/signup', authController.getSignup);

// This is for serving the login page
router.get('/login', authController.getLogin);

// This is for getting user signup data 
router.post('/signup', authController.signup);

// This is for getting user login data
router.post('/login', authController.login);

// This is for serving logout functionallity
router.post('/logout', authController.logout);

module.exports = router;