const express = require('express');

const routes = express.Router();

const VehicleController = require('./controllers/VehicleController');


routes.get('/', (req, res) => {
  return res.status(200).json({ message: 'API is running' });
});

routes.get('/vehicles', VehicleController.getAllVehicles)
routes.get('/vehicle/:id', VehicleController.getOneVehicle)
routes.post('/vehicle/', VehicleController.createVehicle)
routes.put('/vehicle/:id', VehicleController.updateVehicle)

module.exports = routes;