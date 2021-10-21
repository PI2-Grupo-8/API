const ValidationError = require('../utils/validationError')
const { notBlank, isValidObjectId, removeUndefinedValues } = require("./basicValidation");

const validateWorkData = (req_body) => {
  const { vehicleId } = req_body;
  let errors = [];

  Object.keys(req_body).map(key => {
    errors.push(notBlank(req_body[key], key))
  })

  errors.push(!isValidObjectId(vehicleId) ? "Vehicle id is invalid" : null);
  errors = errors.filter(error => error);

  if (errors.length > 0) {
    throw new ValidationError(errors)
  }
}

module.exports = {
  validateWorkData
}