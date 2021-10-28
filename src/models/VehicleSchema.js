const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  owner: {
    type: String,
    require: true,
  },
  code: {
    type: String,
    require: true,
    unique: true
  },
  name: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  fertilizer: {
    type: String,
    require: true
  },
  fertilizerAmount: {
    type: Number,
    require: true
  },
  ipAddress: {
    type: String,
    require: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
