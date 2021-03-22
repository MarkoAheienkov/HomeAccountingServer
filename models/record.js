const {Schema, model} = require('mongoose');

const recordSchema = new Schema({
  title: {
    type: Schema.Types.String,
    required: true,
  },
  description: {
    type: Schema.Types.String,
    required: true,
  },
  amount: {
    type: Schema.Types.Number,
    required: true,
  },
  type: {
    type: Schema.Types.String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
  },
  creationDate: {
    type: Schema.Types.Date,
    required: true,
  },
});

module.exports = model('Record', recordSchema);
