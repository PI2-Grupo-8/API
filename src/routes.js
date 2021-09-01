const express = require('express');

const routes = express.Router();

const VehicleController = require('./controllers/VehicleController');

const { NODE_ENV } = process.env;

routes.get('/', (req, res) => {
  return res.status(200).json({ message: `API is running on ${NODE_ENV}` });
});

routes.get('/vehicles', VehicleController.getAllVehicles);
routes.get('/vehicle/:id', VehicleController.getOneVehicle);
routes.post('/vehicle/create', VehicleController.createVehicle);
routes.put('/vehicle/update/:id', VehicleController.updateVehicle);

module.exports = routes;