const express = require('express');

const routes = express.Router();

const VehicleController = require('./controllers/VehicleController');
const CommandController = require('./controllers/CommandController');
const WorkController = require('./controllers/WorkController');
const { loginRequired } = require('./utils/JWTValidate');

const { NODE_ENV } = process.env;

routes.get('/', (req, res) => {
  return res.status(200).json({ message: `Vehicle API is running on ${NODE_ENV}` });
});

routes.get('/vehicles',loginRequired, VehicleController.getAllVehicles);
routes.get('/vehicles/owner/:owner',loginRequired, VehicleController.getVehiclesByOwner);
routes.get('/vehicle/:id',loginRequired, VehicleController.getOneVehicle);
routes.post('/vehicle/create',loginRequired, VehicleController.createVehicle);
routes.post('/vehicle/setIp/:code',loginRequired, VehicleController.setIpAddress);
routes.put('/vehicle/update/:id',loginRequired, VehicleController.updateVehicle);
routes.delete('/vehicle/delete/:id',loginRequired, VehicleController.deleteVehicle);

routes.get('/commands', loginRequired, CommandController.getAllCommands);
routes.get('/command/:id', loginRequired, CommandController.getCommandsByVehicle);
routes.post('/command/create', loginRequired, CommandController.createCommand);

// Works can receive a query 'status' equal to 'finished' or 'all'
// without this query, it returns only opened status
routes.get('/works/:vehicleId', loginRequired, WorkController.getVehicleWorks);
routes.get('/work/create/:vehicleId', loginRequired, WorkController.createWorkReq);
routes.get('/work/finish/:vehicleId', loginRequired, WorkController.finishWorkReq);

module.exports = routes;