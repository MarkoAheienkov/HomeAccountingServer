const {validationResult} = require('express-validator');

const User = require('../models/user');
const Rate = require('../models/rate');

const transformErrors = require('../helpers/transformError');

const postCreateRate = async (req, res, next) => {
  const {title, mark, text} = req.body;
  const {userId} = req;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation error');
    error.status = 422;
    error.body = {
      errors: transformErrors(errors.array())
    }
    return next(error);
  }
  try {
    const rate = new Rate({
      title: title,
      text: text,
      mark: mark,
      creator: userId,
    });
    await rate.save();
    const user = await User.findById(userId);
    await user.setRate(rate._id);
    return res.status(201).json({
      text: 'Success',
    });
  }
  catch(err) {
    err.status = 500;
    err.body = {
      text: 'Error wac occurred',
    }
    next(err);
  }
};

const getAllRates = async (req, res, next) => {
  try {
    const rates = await Rate.find().populate('creator', 'email username');
    return res.status(200).json({
      rates: rates,
    });
  }
  catch(err) {
    err.status = 500;
    err.body = {
      text: 'Error wac occurred',
    }
    next(err);
  }
};

module.exports = {
  postCreateRate,
  getAllRates,
};
