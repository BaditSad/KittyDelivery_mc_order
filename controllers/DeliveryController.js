const express = require("express");
const router = express.Router();
module.exports = router;
const Order = require("../models/order");

router.get("/tracker/:deliverId", async (req, res) => {
  try {
    const orders = await Order.find({
      order_status: { $nin: ["canceled", "over"] },
      delivery_person_accept_id: req.params.deliverId,
      delivery_status: { $ne: "finished" },
    });
    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "Orders not found for this deliver!" });
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/finished/:deliverId", async (req, res) => {
  try {
    const orders = await Order.find({
      order_status: "over",
      delivery_person_accept_id: req.params.deliverId,
    });
    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "Orders not found for this deliver!" });
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/pending/:deliverId", async (req, res) => {
  try {
    const deliverId = req.params.deliverId;
    const cityName = req.query.city;

    let orders = await Order.find();

    if (cityName) {
      orders = orders.filter((order) => {
        const addressParts = order.restaurant_address.split(",");
        const restaurantCity = addressParts[addressParts.length - 1].trim();
        return restaurantCity.toLowerCase() === cityName.toLowerCase();
      });
    }

    if (deliverId) {
      orders = orders.filter(
        (order) =>
          order.order_status === "accepted" &&
          order.delivery_person_accept_id === null &&
          !order.delivery_person_refuse_id.includes(deliverId)
      );
    }

    if (!orders.length) {
      return res.status(404).json({ message: "Orders not found!" });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/status/:orderId", async (req, res) => {
  try {
    const updates = {
      ...req.body,
      order_status: "over",
      delivery_date: new Date(),
    };
    const order = await Order.findByIdAndUpdate(req.params.orderId, updates, {
      new: true,
      runValidators: true,
    });
    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/accept/:orderId", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/refuse/:orderId", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { $push: req.body },
      { new: true }
    );

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
