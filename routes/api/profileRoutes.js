const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const auth = require('../../middleware/auth');
const profileControllers = require('../../controllers/profileController');

// @router   GET api/profile/me
// @desc     Get current user profile
// @access   PRIVATE

router.get('/me', auth, profileControllers.getCurrentUserProfile);

// @router   POST api/profile
// @desc     Create or update user profile
// @access   PRIVATE

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  profileControllers.createOrUpdateUserProfile
);

// @router   GET api/profile
// @desc     Get all profile
// @access   PUBLIC

router.get('/', profileControllers.getAllProfile);

// @router   GET api/profile/user/:user_id
// @desc     Get profile by iuser ID
// @access   PUBLIC

router.get('/user/:user_id', profileControllers.getProfileById);

// @router   DELETE api/profile
// @desc     Delete profile, user and post
// @access   PUBLIC

router.delete('/', auth, profileControllers.deleteProfileUserPost);

// @router   PUT api/profile/experience
// @desc     Add profile experience
// @access   PRIVATE

router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  profileControllers.addExperience
);

// @router   DELETE api/profile/experience/exp_id
// @desc     Delete experience from profile
// @access   PRIVATE

router.delete('/experience/:exp_id', auth, profileControllers.deleteExperience);

// @router   PUT api/profile/education
// @desc     Add profile education
// @access   PRIVATE

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study date is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  profileControllers.addEducation
);

// @router   DELETE api/profile/education/exp_id
// @desc     Delete education from profile
// @access   PRIVATE

router.delete('/education/:edu_id', auth, profileControllers.deleteEducation);

// @router   GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   PUBLIC

router.get('/github/:username', profileControllers.getGithubRepos);

module.exports = router;
