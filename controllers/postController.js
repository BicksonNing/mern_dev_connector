const { validationResult } = require('express-validator');

const User = require('../models/User');
const Post = require('../models/Post');
const Profile = require('../models/Profile');

exports.createPost = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({
      errors: errors.array(),
    });
  }

  const id = req.user.id;
  const { text } = req.body;

  try {
    const user = await User.findById(id).select('-password');

    const newPost = new Post({
      text,
      name: user.name,
      avatar: user.avatar,
      user: id,
    });

    const post = await newPost.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPost = async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.send(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getPostById = async (req, res) => {
  const postId = req.params.post_id;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: 'No post found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'No post found' });
    }

    res.status(500).send('Server error');
  }
};

exports.deletePost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.post_id;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: 'No post found' });
    }

    if (post.user.toString() !== userId) {
      return res.status(404).json({ msg: 'Not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post Deleted' });
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'No post found' });
    }

    res.status(500).send('Server error');
  }
};

exports.likePost = async (req, res) => {
  const postId = req.params.post_id;
  const userId = req.user.id;

  try {
    const post = await Post.findById(postId);

    // Check if the ppost has already been like

    if (
      post.likes.filter((like) => like.user.toString() === userId).length > 0
    ) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: userId });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.unlikePost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.post_id;

  try {
    const post = await Post.findById(postId);

    if (
      post.likes.filter((like) => like.user.toString() === userId).length === 0
    ) {
      return res.status(404).json({ msg: 'Post has not been liked' });
    }

    //  Get remove index

    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(userId);

    post.likes.splice(removeIndex, 1);

    await post.save();

    res.json({ msg: 'Post unlike successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.addComment = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { text } = req.body;
  const userId = req.user.id;
  const postId = req.params.post_id;

  try {
    const user = await User.findById(userId).select('-password');
    const post = await Post.findById(postId);

    const newComment = {
      text,
      name: user.name,
      avatar: user.avatar,
      user: userId,
    };

    post.comments.unshift(newComment);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteComment = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.post_id;
  const cmtId = req.params.cmt_id;

  try {
    const post = await Post.findById(postId);

    // Pull out comments
    const comments = post.comments.find((comment) => (comment.id = cmtId));

    //Make sure comments exist

    if (!comments) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Check user

    if (comments.user.toString() !== userId) {
      return res.status(401).json({ msg: 'User not authorised' });
    }

    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(userId);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json({ msg: 'Comment deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
