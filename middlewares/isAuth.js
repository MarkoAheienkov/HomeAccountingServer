const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
  const token = req.query._token;
  let decoded;
  try {
    decoded = jwt.verify(token, 'secretCode');
  }
  catch(err) {
    const error = new Error('Problem with authentication');
    error.status = 401;
    error.body = {text: 'Problem with authentication'};
    return next(error);
  }
  if(decoded) {
    req.userId = decoded.id;
    return next();
  } else {
    const error = new Error('Problem with authentication');
    error.status = 401;
    error.body = {text: 'Problem with authentication'};
    return next(error);
  }
};

module.exports = isAuth;
