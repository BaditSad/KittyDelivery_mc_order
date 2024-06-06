const express = require("express");
const router = express.Router();
module.exports = router;
const Order = require("../models/order");

router.get("/:restaurantId/orders", async (req, res) => {
  try {
    const orders = await Order.find(req.params);
    if (!orders) {
      return res
        .status(404)
        .json({ message: "Aucune commande trouvée pour ce restaurant !" });
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:restaurantId/order/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée !" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
