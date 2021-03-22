const ErrorReport = require('../models/errorReport');

module.exports = async (err, req, res, next) => {
  const {status, body} = err;
  if (status >= 500) {
    const errorReport = new ErrorReport({
      error: err,
      status: status,
      body: body,
    });
    await errorReport.save();
  }
  return res.status(status).json({
    ...body,
  });
};
