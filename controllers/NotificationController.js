const express = require("express");
const router = express.Router();
module.exports = router;
const Notification = require("../models/notification");

router.get("/notifications/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const notifications = await Notification.find({ user_id: userId });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
