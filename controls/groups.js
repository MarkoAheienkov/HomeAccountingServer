const {validationResult} = require('express-validator');

const User = require('../models/user');
const Group = require('../models/group');

const transformErrors = require('../helpers/transformError');

const getGroups = async (req, res, next) => {
  const {userId} = req;
  const user = await User.findById(userId).populate('groups');
  return res.status(200).json({
    groupsList: user.groups,
  });
};

const postCreateGroup = async (req, res, next) => {
  const {userId} = req;
  const {title, description, balance} = req.body;
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
    const user = await User.findById(userId);
    const group = new Group({
      title: title,
      description: description,
      balance: balance,
      creator: user._id,
      members: [user._id],
      startBalance: balance,
      creationDate: new Date(),
    });
    await group.save();
    await user.addGroup(group._id);
    return res.status(201).json({
      text: 'Success',
    })
  }
  catch(err) {
    err.status = 500;
    err.body = {
      text: 'Problem was occurred',
    }
    return next(err);
  }
};

const getGroup = async (req, res, next) => {
  const {id} = req.params;
  const {userId} = req;
  const group = await Group.findById(id);
  const isMember = group.isMember(userId);
  const members = await group.getMembers();
  const records = await group.getRecords();
  if (!isMember) {
    const error = new Error('Unauthorized');
    error.status = 401;
    error.body = {
      text: 'Unauthorized',
    }
    return next(error);
  }
  return res.status(200).json({...group._doc, members, records});
};

const postAddUser = async (req, res, next) => {
  const {email, groupId} = req.body;
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
    const group = await Group.findById(groupId);
    const user = await User.findOne({email: email});
    await user.addGroup(groupId);
    await group.addUser(user._id);
    return res.status(200).json({
      text: 'Success',
    });
  }
  catch(err) {
    err.status = 500;
    err.body = {
      text: 'Problem was occurred',
    }
    return next(err);
  }
};

module.exports = {
  getGroups,
  postCreateGroup,
  getGroup,
  postAddUser,
};
