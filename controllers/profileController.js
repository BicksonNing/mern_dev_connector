const { validationResult } = require('express-validator');
const config = require('config');

const Profile = require('../models/Profile');
const User = require('../models/User');
const Post = require('../models/Post');
const request = require('express');

exports.getCurrentUserProfile = async (req, res) => {
  const id = req.user.id;

  try {
    const profile = await Profile.findOne({ user: id }).populate('User', [
      'name',
      'avatar',
    ]);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.createOrUpdateUserProfile = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
  } = req.body;

  // Build profile object

  const profileFields = {};
  profileFields.user = req.user.id;

  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;

  if (skills) {
    profileFields.skills = skills.split(',').map((skill) => skill.trim());
  }

  // Build Social object
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;

  const id = req.user.id;

  try {
    let profile = await Profile.findOne({ user: id });

    if (profile) {
      // Update profile
      profile = await Profile.findOneAndUpdate(
        { user: id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create profile

    profile = new Profile(profileFields);
    await profile.save();
    return res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error...');
  }
};

exports.getProfileById = async (req, res) => {
  const id = req.params.user_id;
  try {
    const profile = await Profile.findOne({ user: id }).populate('user', [
      'name',
      'avatar',
    ]);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    console.error(err.message);
    res.status(500).send('Server Error...');
  }
};

exports.deleteProfileUserPost = async (req, res) => {
  const id = req.user.id;
  try {
    // Remove users posts
    await Post.deleteMany({ user: req.user.id });

    // Remove profile
    await Profile.findOneAndRemove({ user: id });

    // Remove user
    await User.findOneAndRemove({ _id: id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error..');
  }
};

exports.addExperience = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { title, company, location, from, to, current, description } = req.body;

  const newExp = { title, company, location, from, to, current, description };

  const id = req.user.id;

  try {
    const profile = await Profile.findOne({ user: id });

    profile.experience.unshift(newExp);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error...');
  }
};

exports.deleteExperience = async (req, res) => {
  const id = req.user.id;
  const expId = req.params.exp_id;
  try {
    const profile = await Profile.findOne({ user: id });

    //Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(expId);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error...');
  }
};

exports.addEducation = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { school, degree, fieldofstudy, from, to, current, description } =
    req.body;

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description,
  };

  const id = req.user.id;

  try {
    const profile = await Profile.findOne({ user: id });

    profile.education.unshift(newEdu);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error...');
  }
};

exports.deleteEducation = async (req, res) => {
  const id = req.user.id;
  const eduId = req.params.edu_id;

  try {
    const profile = await Profile.findOne({ user: id });

    const removeIndex = profile.education.map((item) => item.id).indexOf(eduId);

    profile.education.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error...');
  }
};

exports.getGithubRepos = async (req, res) => {
  const username = req.params.username;
  try {
    const options = {
      uri: `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientID'
      )}&client_secret=${config.get('githubSecretKey')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error...');
  }
};
