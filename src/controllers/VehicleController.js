const Vehicle = require('../models/VehicleSchema');

const {
  validateVehicleData,
  catchRepeatedValueError
} = require('../utils/validateVehicle')

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    return res.json(vehicles);
  } catch (err) {
    return res.status(400).json({
      message: "Could not get vehicle list",
      error: err
    });
  }
};

const getOneVehicle = async (req, res) => {
  const { id } = req.params;
  try {
    const vehicle = await Vehicle.findById(id);
    return res.json(vehicle);
  } catch (err) {
    return res.status(400).json({
      message: "Could not get vehicle",
      error: err
    });
  }
};

const createVehicle = async (req, res) => {
  const { owner, code, name, description, fertilizer, fertilizerAmount } = req.body;

  try{
    validateVehicleData({ owner, code, name, description, fertilizer, fertilizerAmount })
    const newVehicle = await Vehicle.create({
      owner, code, name, description, fertilizer, fertilizerAmount
    })
    return res.json(newVehicle)
  } catch(err) {
    err = catchRepeatedValueError(err)
    return res.status(400).json({
      message: "Could not create vehicle",
      error: err
    });
  }
};

const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { owner, code, name, description, fertilizer, fertilizerAmount } = req.body;

  try{
    validateVehicleData({ owner, code, name, description, fertilizer, fertilizerAmount })
    const vehicle = await Vehicle.findOneAndUpdate({ _id: id }, {
      owner, code, name, description, fertilizer, fertilizerAmount
    }, { new: true })
    return res.json(vehicle)
  } catch(err) {
    err = catchRepeatedValueError(err)
    return res.status(400).json({
      message: "Could not update vehicle",
      error: err
    });
  }
};

const deleteVehicle = async (req, res) => {
  const { id } = req.params;

  try{
    await Vehicle.findByIdAndDelete({ _id: id })
    return res.json({ message: 'Vehicle deleted' })
  } catch(err) {
    return res.status(400).json({
      message: "Could not delete vehicle",
      error: err
    });
  }
};

module.exports = {
  getAllVehicles,
  getOneVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle
}
