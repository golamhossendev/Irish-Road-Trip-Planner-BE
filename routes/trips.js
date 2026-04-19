const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Trip = require('../models/Trip');

// POST /api/trips/save
// routes/trips.js
router.post('/save', auth, async (req, res) => {
  try {
    const { title, distance, duration, temperature, condition, fuel, essentials } = req.body;

    const newTrip = new Trip({
      user: req.user.id, 
      title,
      distance,
      duration,
      temperature,
      condition,
      fuel,
      essentials
    });

    // CHANGE THIS LINE:
    const savedTrip = await newTrip.save(); // It was newUser.save() before
    
    res.status(201).json(savedTrip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/trips/my-trips (ADD OR FIX THIS ONE)
router.get('/my-trips', auth, async (req, res) => {
    try {
        // We find trips where the 'user' field matches the ID from the JWT
        const trips = await Trip.find({ user: req.user.id }).sort({ dateSaved: -1 });
        res.json(trips);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// DELETE /api/trips/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: "Trip not found" });
        }

        // Check if the trip belongs to the logged-in user
        if (trip.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to delete this trip" });
        }

        await trip.deleteOne();
        res.json({ message: "Trip deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
module.exports = router;