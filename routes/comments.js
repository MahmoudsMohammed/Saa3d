const express = require('express');

// to get params from app.js file
const router = express.Router({mergeParams: true});

const { isLoggedIn } = require('../middleware');

const comments = require('../controllers/comments');
const requests = require('../controllers/requests');
const notifications = require('../controllers/notifications');

router.route('/').post(isLoggedIn, notifications.addNotification, comments.addComment);

router.route('/:commentId')
        .post(isLoggedIn, requests.acceptOffer)
        .delete(isLoggedIn, comments.deleteComment);

module.exports = router;