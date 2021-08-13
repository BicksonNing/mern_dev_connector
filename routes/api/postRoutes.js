const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../middleware/auth');
const postController = require('../../controllers/postController');

// @router   POST api/posts
// @desc     Create a post
// @access   PRIVATE

router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  postController.createPost
);

// @router   GET api/posts
// @desc     Get all post
// @access   PRIVATE

router.get('/', auth, postController.getPost);

// @router   GET api/posts/:post_id
// @desc     Get post by id
// @access   PRIVATE

router.get('/:post_id', auth, postController.getPostById);

// @router   DELETE api/posts/:post_id
// @desc     Delete post
// @access   PRIVATE

router.delete('/:post_id', auth, postController.deletePost);

// @router   PUT api/posts/like/:post_id
// @desc     Like a post
// @access   PRIVATE

router.put('/like/:post_id', auth, postController.likePost);

// @router   PUT api/posts/unlike/:post_id
// @desc     UnLike a post
// @access   PRIVATE

router.put('/unlike/:post_id', auth, postController.unlikePost);

// @router   POST api/posts/comment/:post_id
// @desc     Comment on a post
// @access   PRIVATE

router.post(
  '/comment/:post_id',
  [auth, check('text', 'Text is required').not().isEmpty()],
  postController.addComment
);

// @router   DELETE api/posts/comment/:post_id/:cmt_id
// @desc     Delete a comment
// @access   PRIVATE

router.delete('/comment/:post_id/:cmt_id', auth, postController.deleteComment);

module.exports = router;
