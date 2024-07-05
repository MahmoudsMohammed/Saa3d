const express = require('express');

const router = express.Router();
const chats = require('../controllers/chats');
const { isLoggedIn, isAchatMember } = require('../middleware');

router.post('/', isLoggedIn, chats.findChat);
router.get('/:userId/main', isLoggedIn, chats.renderMain);
router.get('/:chatId', isLoggedIn, isAchatMember, chats.renderChat);

module.exports = router;