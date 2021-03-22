const {Schema, model} = require('mongoose');

const rateSchema = new Schema({
  title: {
    type: Schema.Types.String,
    required: true,
  },
  text: {
    type: Schema.Types.String,
    required: true,
  },
  mark: {
    type: Schema.Types.Number,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
});

module.exports = model('Rate', rateSchema);
