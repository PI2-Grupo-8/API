const Vehicle = require('../models/VehicleSchema');

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
  const { owner, code, name, description } = req.body;

  // TODO: Validade fields

  try{
    const newVehicle = await Vehicle.create({
      owner, code, name, description
    })
    return res.json(newVehicle)
  } catch(err) {
    return res.status(400).json({
      message: "Could not create vehicle",
      error: err
    });
  }
};

const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { owner, code, name, description } = req.body;

  // TODO: Validade fields

  try{
    const vehicle = await Vehicle.findOneAndUpdate({ _id: id }, {
      owner, code, name, description
    }, { new: true })
    return res.json(vehicle)
  } catch(err) {
    return res.status(400).json({
      message: "Could not update vehicle",
      error: err
    });
  }
};

module.exports = {
  getAllVehicles,
  getOneVehicle,
  createVehicle,
  updateVehicle
}
