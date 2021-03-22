const {validationResult} = require('express-validator');

const Record = require('../models/record');
const User = require('../models/user');
const Group = require('../models/group');

const transformErrors = require('../helpers/transformError');

const getRecordType = (amount) => {
  let type;
  if (amount >= 0 ) {
    type = 'income';
  } else {
    type = 'outcome';
  }
  return type;
};

const postAddRecord = async (req, res, next) => {
  const {groupId, title, amount, description} = req.body;
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
    const record = new Record({
      title: title,
      description: description,
      amount: amount,
      type: getRecordType(amount),
      creator: userId,
      groupId: groupId,
      creationDate: new Date(),
    });

    await record.save();
    const user = await User.findById(userId);
    const group = await Group.findById(groupId);

    await user.addRecord(record._id);
    await group.addRecord(record._id);

    return res.status(201).json({
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
  postAddRecord,
};
