const bcrypt = require('bcryptjs');
const {body} = require('express-validator');

const User = require('../models/user');
const Group = require('../models/group');

const signInValidation = [
  body('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Email is not valid')
    .custom(async (value, {req}) => {
      const userDoc = await User.findOne({email: value});
      if (!userDoc) {
        throw new Error('Email or password isn`t correct');
      }
      return true;
    })
    .withMessage('Email or password isn`t correct'),
  body('password')
    .trim()
    .isLength({min: 4, max: 10})
    .withMessage('Must have at least 4 characters and less or equal to 10')
    .custom(async (value, {req}) => {
      const {email} = req.body;
      const userDoc = await User.findOne({email: email});
      if (!userDoc) {
        throw new Error('Email or password isn`t correct');
      }
      const areSimilar = await bcrypt.compare(value, userDoc.password);
      if (!areSimilar) {
        throw new Error('Email or password isn`t correct');
      }
      return true;
    })
    .withMessage('Email or password isn`t correct'),
];

const signUpValidation = [
  body('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Email is not valid')
    .custom( async (value) => {
      const userDoc = await User.findOne({email: value});
      if (userDoc) {
        throw new Error('Email is in use');
      }
      return true;
    })
    .withMessage('Email is in use'),
  body('password')
    .trim()
    .isLength({min: 4, max: 10})
    .withMessage('Must have at least 4 characters and less or equal to 10'),
  body('confirmPassword')
    .trim()
    .custom((value, {req}) => {
      return value === req.body.password;
    })
    .withMessage('Password must match'),
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Can`t be empty'),
];

const postGroupValidation = [
  body('balance')
    .trim()
    .notEmpty()
    .withMessage('Can`t be empty')
    .isNumeric()
    .withMessage('Must be a number'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Can`t be empty'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Can`t be empty'),
];

const postAddUserValidation = [
  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Email is not valid')
    .custom( async (value) => {
      const userDoc = await User.findOne({email: value});
      if (!userDoc) {
        throw new Error('Email is not in use');
      }
      return true;
    })
    .withMessage('Email is not in use')
    .custom( async (value, {req}) => {
      const {groupId} = req.body;
      const group = await Group.findById(groupId);
      const user = await User.findOne({email: value});
      if (group.isMember(user._id)) {
        throw new Error('User is already in this group');
      }
      return true;
    })
    .withMessage('User is already in this group'),
];

const postAddRecordValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Can`t be empty'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Can`t be empty'),
  body('amount')
    .trim()
    .notEmpty()
    .withMessage('Can`t be empty')
    .isNumeric()
    .withMessage('Must be a number'),
];

const postAddRateValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Can`t be empty'),
  body('text')
    .trim()
    .notEmpty()
    .withMessage('Can`t be empty'),
  body('mark')
    .trim()
    .notEmpty()
    .withMessage('Can`t be empty')
    .isNumeric()
    .withMessage('Must be a number')
    .custom((value) => {
      return value >= 0 && value <=5;
    })
    .withMessage('Must be between 0 and 5'),
];

module.exports = {
  signUpValidation,
  signInValidation,
  postGroupValidation,
  postAddUserValidation,
  postAddRecordValidation,
  postAddRateValidation,
};
