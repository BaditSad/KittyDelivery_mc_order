const express = require("express");
const router = express.Router();
module.exports = router;
const Order = require("../models/order");

router.get("/:userId", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await Order.find({ user_id: req.params.userId })
      .skip(skip)
      .limit(limit);

    const totalUsers = await Order.countDocuments({
      user_id: req.params.userId,
    });

    if (!users) {
      return res.status(404).json({ message: "Not found" });
    }

    if (users.length === 0) {
      return res.status(201).json({ message: "Empty" });
    }

    res.status(201).json({
      totalPages: Math.ceil(totalUsers / limit),
      users: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/pending/:userId", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await Order.find({
      user_id: req.params.userId,
      order_status: { $nin: ["over", "canceled"] },
    })
      .skip(skip)
      .limit(limit);

    const totalUsers = await Order.countDocuments({
      user_id: req.params.userId,
      order_status: { $nin: ["over", "canceled"] },
    });

    if (!users) {
      return res.status(404).json({ message: "Not found" });
    }

    if (users.length === 0) {
      return res.status(201).json({ message: "Empty" });
    }

    res.status(201).json({
      totalPages: Math.ceil(totalUsers / limit),
      users: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
