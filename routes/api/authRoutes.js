const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../middleware/auth');
const authController = require('../../controllers/authController');

// @router   GET api/auth
// @desc     Test Route
// @access   PUBLIC

router.get('/', auth, authController.authUser);

// @router   POST api/auth
// @desc     Authenticate user & get token
// @access   PUBLIC

router.post(
  '/',
  [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authController.login
);

module.exports = router;
