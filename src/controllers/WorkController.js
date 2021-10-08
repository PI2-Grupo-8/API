const Work = require('../models/WorkSchema');
const ValidationError = require('../utils/validationError')
const { validateWorkData } = require("../utils/validateWork");

const defineSearchStatusParam = (status) => {
  if (status === 'all') {
    return {};
  }
  if (status === 'finished') {
    return { finishedAt: { $ne: null } };
  }

  return { finishedAt: null };
};

const getVehicleWorks = async (req, res) => {
  const { vehicleId } = req.params;
  const { status } = req.query;

  try {
    const search = defineSearchStatusParam(status);
    const works = await Work.find({ vehicleId, ...search });
    return res.json(works);
  } catch (err) {
    return res.status(400).json({
      message: "Could not get work list",
      error: err
    });
  }
};

const createWork = async (vehicleId) => {
  validateWorkData({ vehicleId });
  const hasOpenWorks = await Work.find({ vehicleId, finishedAt: null });
  if (hasOpenWorks.length > 0) {
    throw new ValidationError('Vehicle has an opened work')
  }
  return await Work.create({ vehicleId });
}

const finishWork = async (vehicleId) => {
  const finishedAt = Date.now()
  validateWorkData({ vehicleId });
  return await Work.findOneAndUpdate({ vehicleId, finishedAt: null }, {
    finishedAt
  }, { new: true });
}

const createWorkReq = async (req, res) => {
  const { vehicleId } = req.params;

  try {
    const newWork = await createWork(vehicleId);
    return res.json(newWork)
  } catch (err) {
    return res.status(400).json({
      message: "Could not create work",
      error: err
    });
  }
};

const finishWorkReq = async (req, res) => {
  const { vehicleId } = req.params;
  try {
    const work = await finishWork(vehicleId);
    return res.json(work)
  } catch (err) {
    return res.status(400).json({
      message: "Could not finish work",
      error: err
    });
  }
}

module.exports = {
  getVehicleWorks,
  createWork,
  finishWork,
  createWorkReq,
  finishWorkReq
}