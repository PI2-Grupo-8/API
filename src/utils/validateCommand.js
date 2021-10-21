const ValidationError = require('../utils/validationError')
const { notBlank, isValidObjectId } = require("./basicValidation");
const { COMMAND_TYPES } = require('../utils/commandTypes');

const validateCommandData = (req_body) => {
    const { vehicleId, type } = req_body;
    let errors = [];

    Object.keys(req_body).map(key => {
        errors.push(notBlank(req_body[key], key))
    })

    errors.push(!isValidObjectId(vehicleId) ? "Vehicle id is invalid" : null);
    errors.push(COMMAND_TYPES.includes(type)? null : "Command is not valid");

    errors = errors.filter( error => error);

    if (errors.length > 0) {
        throw new ValidationError(errors)
    }
}

module.exports = {
    validateCommandData
}