const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');

exports.authUser = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await User.findById(id).select('-password');
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    const isMatch = user && (await bcrypt.compare(password, user.password));

    if (!user && !isMatch) {
      return res.status(400).json({
        errors: [{ msg: 'Invalid Credentials' }],
      });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const token = jwt.sign(payload, config.get('jwtSecret'), {
      expiresIn: 360000,
    });

    res.json({
      user: user.toObject({ getters: true }),
      token: token,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
