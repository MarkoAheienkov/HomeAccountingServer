const {Schema, model} = require('mongoose');

const Record = require('./record');

const groupSchema = new Schema({
  title: {
    required: true,
    type: Schema.Types.String,
  },
  description: {
    required: true,
    type: Schema.Types.String,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  balance: {
    required: true,
    type: Schema.Types.Number,
  },
  startBalance: {
    required: true,
    type: Schema.Types.Number,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  ],
  records: [
    {
      recordId: {
        type: Schema.Types.ObjectId,
        ref: 'Record',
        required: true,
      },
      balance: {
        required: true,
        type: Schema.Types.Number,
      }
    }
  ],
  creationDate: {
    type: Schema.Types.Date,
    required: true,
  },
});

groupSchema.methods.isMember = function(userId) {
  const index = this.members.findIndex((id) => id.toString() === userId.toString());
  return index > -1;
};

groupSchema.methods.getMembers = async function() {
  const group = await model('Group').findById(this._id).populate('members');
  return group.members.map(({email, username, _id}) => ({username, email, _id}));
};

groupSchema.methods.getRecords = async function() {
  const groupDoc = await this.populate('records.recordId').execPopulate();
  const group = await groupDoc.populate('records.recordId.creator').execPopulate();
  return group.records.map((record) => {
    const {recordId, balance} = record;
    const {email, username} = recordId.creator;
    const {_id, title, description, amount, type, creationDate} = recordId;
    const recordDoc = {_id, title, description, amount, type, creationDate};
    return {
      ...recordDoc,
      creator: {email, username},
      balance: balance,
    }
  });
};

groupSchema.methods.addUser = async function(userId) {
  this.members.push(userId);
  await this.save();
}

groupSchema.methods.addRecord = async function(recordId) {
  const record = await Record.findById(recordId);
  this.balance += Number(record.amount);
  if (!this.records) {
    this.records = [];
  }
  this.records.push({
    recordId: record._id,
    balance: this.balance,
  });
  await this.save();
}

module.exports = model('Group', groupSchema);
