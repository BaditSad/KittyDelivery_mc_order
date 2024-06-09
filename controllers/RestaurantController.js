const express = require("express");
const router = express.Router();
module.exports = router;
const Order = require("../models/order");

router.get("/:restaurantId", async (req, res) => {
    try {
      const orders = await Order.find({ restaurant_id: req.params.restaurantId });
      if (!orders) {
        return res
          .status(404)
          .json({ message: "Orders not found for this restaurant!" });
      }
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });