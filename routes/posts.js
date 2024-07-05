const express = require('express');

const router = express.Router();
const { isLoggedIn } = require('../middleware');
const posts = require('../controllers/posts');

//isLoggedIn
router.route('/main')
        .get(isLoggedIn, posts.renderMain);

router.route('/post/new')
      .get(isLoggedIn, posts.renderNewForm)
      .post(isLoggedIn, posts.createPost);
      
router.route('/main/search')
      .get(isLoggedIn, posts.renderSearch)
      .post(isLoggedIn, posts.findData);

router.route('/post/:postId')
      .get(isLoggedIn, posts.showPost)
      .delete(isLoggedIn, posts.deletePost)
      .put(isLoggedIn, posts.updatePost);


module.exports = router;