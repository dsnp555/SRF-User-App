const express = require('express');
const router = express.Router();
const { findRoute, assignDriver } = require('../controllers/rideController');

router.post('/match', (req, res) => {
  // Endpoint for ride matching
  const { pickup, dropoff } = req.body;
  // Use Dijkstra algorithm to find optimal route
  const route = findRoute(pickup, dropoff);
  res.json({ route });
});

router.post('/assign', (req, res) => {
  // Endpoint for assigning a driver
  const { rideId, driverId } = req.body;
  const result = assignDriver(rideId, driverId);
  res.json(result);
});

module.exports = router;