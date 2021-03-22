const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const transformErrors = require('../helpers/transformError');

const signIn = async (req, res, next) => {
  const errors = validationResult(req);
  const {email} = req.body;
  if (!errors.isEmpty()) {
    const error = new Error('Validation error');
    error.status = 422;
    error.body = {
      errors: transformErrors(errors.array())
    }
    return next(error);
  }
  try {
    const user = await User.findOne({email: email});
    const token = jwt.sign({
      id: user._id.toString(),
    }, 'secretCode', {
      expiresIn: '1h',
    });
    return res.status(200).json({token});
  }
  catch(err) {
    err.status = 500;
    error.body = {
      text: 'Problem was occurred',
    }
    return next(err);
  }
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  const {email, username, password} = req.body;
  if (!errors.isEmpty()) {
    const error = new Error('Validation error');
    error.status = 422;
    error.body = {
      errors: transformErrors(errors.array())
    }
    return next(error);
  }
  try {
    const hashPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      username: username,
      password: hashPassword,
    });
    await user.save();
    return res.status(200).json({
      text: 'Success'
    });
  }
  catch(err) {
    err.status = 500;
    error.body = {
      text: 'Problem was occurred',
    }
    return next(err);
  }
};


module.exports = {
  signIn,
  signUp,
};
