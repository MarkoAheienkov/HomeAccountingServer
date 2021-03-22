const {promisify} = require('util');

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRouter = require('./routes/auth');
const groupsRouter = require('./routes/groups');
const recordsRouter = require('./routes/records');
const ratesRouter = require('./routes/rates');

const errorHandler = require('./middlewares/errorHandler');

const uri = "mongodb+srv://obJnIjUEX9BfUfP2:obJnIjUEX9BfUfP2@cluster0.vwccs.mongodb.net/HomeAccounting?retryWrites=true&w=majority";

const app = express();

app.use(bodyParser.json());
app.use(helmet());
app.use(cors());

app.use('/auth', authRouter);
app.use('/groups', groupsRouter);
app.use('/records', recordsRouter);
app.use('/rates', ratesRouter);

app.use(errorHandler);

const serverStart = async () => {
  const port = process.env.PORT || 5000;
  try {
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true,});
    await promisify(app.listen).bind(app)(port);
  }
  catch(err) {

  }
};

serverStart();
