const express = require('express');
const router = express.Router();
const userControllers = require('../../controllers/userControllers');
const { check } = require('express-validator');

// @router   GET api/user
// @desc     Test Route
// @access   PUBLIC

router.get('/', (req, res) => res.send('user route'));

// @router   POST api/user
// @desc     Register User
// @access   PUBLIC

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  userControllers.registerUser
);

module.exports = router;
