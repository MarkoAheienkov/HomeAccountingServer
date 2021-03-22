const {model, Schema} = require('mongoose');

const errorReportSchema = new Schema({
  error: {
    required: true,
    type: Object,
  },
  status: {
    type: Schema.Types.Number,
    required: false,
  },
  body: {
    type: Schema.Types.String,
    required: false,
  }
});

module.exports = model('ErrorReport', errorReportSchema);
