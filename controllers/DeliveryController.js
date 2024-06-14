const express = require("express");
const router = express.Router();
module.exports = router;
const Order = require("../models/order");

router.get("/tracker/:deliverId", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const deliveries = await Order.find({
      order_status: { $nin: ["canceled", "over"] },
      delivery_person_accept_id: req.params.deliverId,
      delivery_status: { $ne: "finished" },
    })
      .skip(skip)
      .limit(limit);

    const totalDeliveries = await Order.countDocuments({
      order_status: { $nin: ["canceled", "over"] },
      delivery_person_accept_id: req.params.deliverId,
      delivery_status: { $ne: "finished" },
    });

    if (!deliveries) {
      return res.status(404).json({ message: "Not found" });
    }

    if (deliveries.length === 0) {
      return res.status(201).json({ message: "Empty" });
    }

    res.status(201).json({
      totalPages: Math.ceil(totalDeliveries / limit),
      deliveries: deliveries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/finished/:deliverId", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const deliveries = await Order.find({
      order_status: "over",
      delivery_person_accept_id: req.params.deliverId,
    })
      .skip(skip)
      .limit(limit);

    const totalDeliveries = await Order.countDocuments({
      order_status: "over",
      delivery_person_accept_id: req.params.deliverId,
    });

    if (!deliveries) {
      return res.status(404).json({ message: "Not found" });
    }

    if (deliveries.length === 0) {
      return res.status(201).json({ message: "Empty" });
    }

    res.status(201).json({
      totalPages: Math.ceil(totalDeliveries / limit),
      deliveries: deliveries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/pending/:deliverId", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let cityQuery = {};

    if (req.query.city) {
      const cityRegex = new RegExp(`,\\s*${req.query.city.trim()}$`, "i");
      cityQuery = { restaurant_address: { $regex: cityRegex } };
    }

    const deliveries = await Order.find({
      ...cityQuery,
      order_status: "accepted",
      delivery_person_accept_id: null,
      delivery_person_refuse_id: { $nin: [req.params.deliverId] },
    })
      .skip(skip)
      .limit(limit);

    const totalDeliveries = await Order.countDocuments({
      ...cityQuery,
      order_status: "accepted",
      delivery_person_accept_id: null,
      delivery_person_refuse_id: { $nin: [req.params.deliverId] },
    });

    if (!deliveries) {
      return res.status(404).json({ message: "Not found" });
    }

    if (deliveries.length === 0) {
      return res.status(201).json({ message: "Empty" });
    }

    res.status(201).json({
      totalPages: Math.ceil(totalDeliveries / limit),
      deliveries: deliveries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/status/:orderId", async (req, res) => {
  try {
    const delivery = await Order.findByIdAndUpdate(
      req.params.orderId,
      { ...req.body, order_status: "over", delivery_date: new Date() },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!delivery) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(201).json({ message: "item updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/accept/:orderId", async (req, res) => {
  try {
    const delivery = await Order.findByIdAndUpdate(
      req.params.orderId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!delivery) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(201).json({ message: "item updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/refuse/:orderId", async (req, res) => {
  try {
    const delivery = await Order.findByIdAndUpdate(
      req.params.orderId,
      { $push: req.body },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(201).json({ message: "item updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
