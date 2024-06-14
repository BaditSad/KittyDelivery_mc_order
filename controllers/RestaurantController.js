const express = require("express");
const router = express.Router();
module.exports = router;
const Order = require("../models/order");

router.get("/pending/:restaurantId", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const restaurantPending = await Order.find({
      restaurant_id: req.params.restaurantId,
      order_status: "pending",
    })
      .skip(skip)
      .limit(limit);

    const totalRestaurantPending = await Order.countDocuments({
      restaurant_id: req.params.restaurantId,
      order_status: "pending",
    });

    if (!restaurantPending) {
      return res.status(404).json({ message: "Not found" });
    }

    if (restaurantPending.length === 0) {
      return res.status(201).json({ message: "Empty" });
    }

    res.status(201).json({
      totalPages: Math.ceil(totalRestaurantPending / limit),
      restaurants: restaurantPending,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/refused/:restaurantId", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const restaurantRefused = await Order.find({
      restaurant_id: req.params.restaurantId,
      order_status: "refused",
    })
      .skip(skip)
      .limit(limit);

    const totalRestaurantRefused = await Order.countDocuments({
      restaurant_id: req.params.restaurantId,
      order_status: "refused",
    });

    if (!restaurantRefused) {
      return res.status(404).json({ message: "Not found" });
    }

    if (restaurantRefused.length === 0) {
      return res.status(201).json({ message: "Empty" });
    }

    res.status(201).json({
      totalPages: Math.ceil(totalRestaurantRefused / limit),
      restaurants: restaurantRefused,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/accepted/:restaurantId", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const restaurantAccepted = await Order.find({
      restaurant_id: req.params.restaurantId,
      order_status: "accepted",
    })
      .skip(skip)
      .limit(limit);

    const totalRestaurantAccepted = await Order.countDocuments({
      restaurant_id: req.params.restaurantId,
      order_status: "accepted",
    });

    if (!restaurantAccepted) {
      return res.status(404).json({ message: "Not found" });
    }

    if (restaurantAccepted.length === 0) {
      return res.status(201).json({ message: "Empty" });
    }

    res.status(201).json({
      totalPages: Math.ceil(totalRestaurantAccepted / limit),
      restaurants: restaurantAccepted,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
