const {Schema, model} = require('mongoose');

const Group = require('./group');

const userSchema = new Schema({
  email: {
    type: Schema.Types.String,
    required: true,
  },
  username: {
    type: Schema.Types.String,
    required: true,
  },
  password: {
    type: Schema.Types.String,
    required: true,
  },
  groups: [{
      ref: 'Group',
      type: Schema.Types.ObjectId,
      required: true,
  }],
  rate: {
    ref: 'Rate',
    type: Schema.Types.ObjectId,
    required: false,
  },
});

userSchema.methods.addGroup = async function (groupId) {
  const group = await Group.findById(groupId);
  if (group) {
    this.groups.push(groupId);
    await this.save();
  }
};

userSchema.methods.setRate = async function(rateId) {
  this.rate = rateId;
  await this.save();
}

userSchema.methods.addRecord = async function (recordId) {
  if (!this.records) {
    this.records = [];
  }
  this.records.push(recordId);
  await this.save();
}

module.exports = model('User', userSchema);
