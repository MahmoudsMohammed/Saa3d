const express = require('express');

// to get params from app.js file
const router = express.Router({mergeParams: true});

const { isLoggedIn } = require('../middleware');

const requests = require('../controllers/requests');
const notifications = require('../controllers/notifications');

router.route('/:serviceId')
        .get(isLoggedIn, requests.jobFinished)
        .post(isLoggedIn, requests.postReview);

module.exports = router;