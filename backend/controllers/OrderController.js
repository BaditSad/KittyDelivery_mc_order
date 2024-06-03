const express = require("express");
const router = express.Router();
module.exports = router;
const Order = require("../models/order");

router.get("/restaurants/:restaurantId/orders", async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const orders = await Order.find({ restaurant_id: restaurantId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
