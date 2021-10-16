const Command = require("../models/CommandSchema");
const { START_WORK, STOP_WORK } = require("../utils/commandTypes");
const { validateCommandData } = require("../utils/validateCommand");
const { createWork, finishWork } = require('./WorkController')

const getAllCommands = async (req, res) => {
  try {
    const commands = await Command.find();
    return res.json(commands);
  } catch (err) {
    return res.status(400).json({
      message: "Could not get command list",
      error: err
    });
  }
}

const getCommandsByVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    const commands = await Command.find({ "vehicleId": id });
    return res.json(commands);
  } catch (err) {
    return res.status(400).json({
      message: "Could not get command list",
      error: err
    });
  }
}

const createCommand = async (req, res) => {
  const { vehicleId, type } = req.body;

  try {
    validateCommandData(req.body);

    if (type === START_WORK)
      await createWork(vehicleId);
    if (type === STOP_WORK)
      await finishWork(vehicleId);

    const newCommand = await Command.create({
      vehicleId,
      type
    });
    return res.json(newCommand);
  } catch (err) {
    return res.status(400).json({
      message: "Could not create command",
      error: err
    });
  }
}

module.exports = {
  getAllCommands,
  getCommandsByVehicle,
  createCommand
}