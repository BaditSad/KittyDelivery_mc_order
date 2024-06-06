var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var notificationSchema = new Schema({
  notification_type: { type: String, required: true },
  notification_message: { type: String, required: true },
  notification_date: { type: Date, required: true },
  user_id: { type: Number, required: true },
});

module.exports = mongoose.model("Notification", notificationSchema);
