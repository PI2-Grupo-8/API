const express = require('express');

const routes = express.Router();

const VehicleController = require('./controllers/VehicleController');
const { loginRequired } = require('./utils/JWTValidate');

const { NODE_ENV } = process.env;

routes.get('/', (req, res) => {
  return res.status(200).json({ message: `API is running on ${NODE_ENV}` });
});

routes.get('/vehicles', loginRequired, VehicleController.getAllVehicles);
routes.get('/vehicle/:id', loginRequired, VehicleController.getOneVehicle);
routes.post('/vehicle/create', loginRequired, VehicleController.createVehicle);
routes.put('/vehicle/update/:id', loginRequired, VehicleController.updateVehicle);
routes.delete('/vehicle/delete/:id', loginRequired, VehicleController.deleteVehicle);

module.exports = routes;