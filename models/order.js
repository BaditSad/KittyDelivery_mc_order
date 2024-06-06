const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user_id: { type: Number, required: true },
  restaurant_id: { type: Number, required: true },
  order_date: { type: Date, required: true },
  order_status: { type: String, required: true },
  order_total_amount: { type: Number, required: true },
  order_items: { type: [String], required: true },
  delivery_address : { type: String, required: true},
  delivery_person_accept_id: { type: Number, required: false },
  delivery_person_refuse_id: { type: [Number], required: false },
  delivery_date: { type: Date, required: false },
  qr_code: { type: String, required: true },
});

module.exports = mongoose.model('Order', orderSchema);