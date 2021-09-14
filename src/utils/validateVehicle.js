const ValidationError = require('../utils/validationError')
const ObjectId = require('mongoose').Types.ObjectId;

function isValidObjectId(id) {
  if (ObjectId.isValid(id)) {
    if ((String)(new ObjectId(id)) === id)
      return true;
    return false;
  }
  return false;
}

const removeUndefinedValues = (arr) => {
  return arr.filter((element) => {
    return element !== undefined;
  });
}

const notBlank = (item, label) => {
  if (!item) {
    return `${label} must not be blank`
  }
}

const fertilizerAmountValidation = (amount) => {
  if (amount && isNaN(amount)) {
    return 'fertilizerAmount must be a number (measure in ml)'
  }
}

const codeValidation = (code) => {
  const regex = /^[A-Z0-9]{4}$/
  if (code && !regex.test(code)) {
    return 'code must be 4 digits with only numbers and uppercase letters'
  }
}

const ownerValidation = (owner) => {
  if (owner && !isValidObjectId(owner)) {
    return 'owner must be a user ID'
  }
}

const validateVehicleData = (req_body) => {

  const { owner, code, fertilizerAmount } = req_body;
  errors = []

  Object.keys(req_body).map((key) => {
    errors.push(notBlank(req_body[key], key))
  })

  errors.push(codeValidation(code))
  errors.push(fertilizerAmountValidation(fertilizerAmount))
  errors.push(ownerValidation(owner))

  errors = removeUndefinedValues(errors)

  if(errors.length > 0){
    throw new ValidationError(errors)
  }
}

const catchRepeatedValueError = (error) => {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    let nonUniqueValues = Object.keys(error.keyPattern)
    return new ValidationError([`${nonUniqueValues} must be unique`])
  }
  return error
}

module.exports = {
  validateVehicleData,
  catchRepeatedValueError
}