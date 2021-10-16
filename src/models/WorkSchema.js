const mongoose = require("mongoose");

const WorkSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    require: true
  },
  finishedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Work', WorkSchema)