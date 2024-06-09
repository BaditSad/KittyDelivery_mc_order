const express = require("express");
const router = express.Router();
module.exports = router;
const Order = require("../models/order");

router.get("/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.params.userId });
    if (!orders) {
      return res
        .status(404)
        .json({ message: "Orders not found for this user!" });
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/pending/:userId", async (req, res) => {
  try {
    const orders = await Order.find({
      user_id: req.params.userId,
      order_status: { $nin: ["over", "canceled"] },
    });

    if (!orders) {
      return res
        .status(404)
        .json({ message: "Orders not found for this user!" });
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
