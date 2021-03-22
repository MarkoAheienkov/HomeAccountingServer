module.exports = (errors) => {
  const transformedErrors = {};
  errors.forEach((error) => {
    const {param, msg} = error;
    if (!transformedErrors[param]) {
      transformedErrors[param] = {errors: []};
    }
    transformedErrors[param].errors.push(msg);
  });
  return transformedErrors;
}

