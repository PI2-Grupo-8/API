const mongoose = require("mongoose");
const { COMMAND_TYPES } = require("../utils/commandTypes");

const CommandSchema = new mongoose.Schema({
    vehicleId: {
        type: String,
        require: true
    },
    type: {
        type: String,
        enum: COMMAND_TYPES,
        require: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Command', CommandSchema)