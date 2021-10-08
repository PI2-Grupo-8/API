const express = require('express');

const routes = express.Router();

const VehicleController = require('./controllers/VehicleController');
const CommandController = require('./controllers/CommandController');
const WorkController = require('./controllers/WorkController');

const { NODE_ENV } = process.env;

routes.get('/', (req, res) => {
  return res.status(200).json({ message: `Vehicle API is running on ${NODE_ENV}` });
});

routes.get('/vehicles', VehicleController.getAllVehicles);
routes.get('/vehicles/owner/:owner', VehicleController.getVehiclesByOwner);
routes.get('/vehicle/:id', VehicleController.getOneVehicle);
routes.post('/vehicle/create', VehicleController.createVehicle);
routes.put('/vehicle/update/:id', VehicleController.updateVehicle);
routes.delete('/vehicle/delete/:id', VehicleController.deleteVehicle);

routes.get('/commands', CommandController.getAllCommands);
routes.get('/command/:id', CommandController.getCommandsByVehicle);
routes.post('/command/create', CommandController.createCommand);

// Works can receive a query 'status' equal to 'finished' or 'all'
// without this query, it returns only opened status
routes.get('/works/:vehicleId', WorkController.getVehicleWorks);
routes.get('/work/create/:vehicleId', WorkController.createWorkReq);
routes.get('/work/finish/:vehicleId', WorkController.finishWorkReq);

module.exports = routes;