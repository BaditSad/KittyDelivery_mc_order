const express = require("express");
const router = express.Router();
module.exports = router;
const Delivery = require("../models/delivery");

router.get("/deliveries/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const delivery = await Delivery.find({ restaurant_id: restaurantId });
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
