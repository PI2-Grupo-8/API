const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  owner: {
    type: String,
    require: [true],
  },
  code: {
    type: String,
    require: [true]
  },
  name: {
    type: String,
    require: [true]
  },
  description: {
    type: String,
    require: [false]
  },
  createdAt: {
    type: Date,
    require: [true],
  },
  updatedAt: {
    type: Date,
    require: [true],
  },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
