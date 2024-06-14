const express = require("express");
const router = express.Router();
module.exports = router;
const Order = require("../models/order");

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find().skip(skip).limit(limit);

    const totalOrders = await Order.countDocuments();

    if (!orders) {
      return res.status(404).json({ message: "Not found" });
    }

    if (orders.length === 0) {
      return res.status(201).json({ message: "Empty" });
    }

    res.status(201).json({
      totalPages: Math.ceil(totalOrders / limit),
      orders: orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/status/:orderId", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.orderId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(201).json({ message: "Item updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      user_name,
      restaurant_id,
      restaurant_name,
      restaurant_address,
      order_total_amount,
      order_items,
      delivery_address,
    } = req.body;

    const customCode = Object.values(req.body)
      .map((value) => String(value).charAt(0))
      .join("");

    const order = new Order({
      user_id: user_id,
      user_name: user_name,
      restaurant_id: restaurant_id,
      restaurant_name: restaurant_name,
      restaurant_address: restaurant_address,
      order_date: new Date(),
      order_total_amount: order_total_amount,
      order_items: order_items,
      order_status: "pending",
      delivery_address: delivery_address,
      delivery_status: "pending",
      delivery_person_accept_id: null,
      delivery_person_refuse_id: [],
      delivery_date: null,
      qr_code: customCode,
    });

    await order.save();

    res.status(201).json({ message: "Item posted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
