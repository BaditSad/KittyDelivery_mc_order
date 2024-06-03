const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user_id: { type: Number, required: true },
  restaurant_id: { type: Number, required: true },
  delivery_id: { type: Schema.Types.ObjectId, required: false },
  order_date: { type: Date, required: true },
  order_status: { type: String, required: true },
  order_total_amount: { type: Number, required: true },
  order_items: { type: String, required: true },
});

module.exports = mongoose.model("Order", orderSchema);
