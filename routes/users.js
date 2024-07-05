const express = require('express');

// require passport to make user register & login more easier
const passport = require('passport');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');
const notifications = require('../controllers/notifications');
const { isLoggedIn } = require('../middleware');


// to allow uploading files (images)
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderRegister)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/standing', isLoggedIn, users.renderStanding);

router.get('/profile/:userId', isLoggedIn, users.renderProfile);

router.route('/profile/:userId/settings')
      .get(isLoggedIn, users.renderSettings)
      .post(isLoggedIn, upload.array('image'), users.updateSettings);

router.route('/profile/:userId/notifications')
        .get(isLoggedIn, notifications.renderNotifications);
      
router.get('/logout', users.logout);

module.exports = router;