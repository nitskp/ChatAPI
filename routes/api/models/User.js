const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sentTime: {
    type: Date,
    default: () => Date.now(),
  },
  message: String,
  // receiver:USERS.id Remove it for the timebeing
});

const userSchema = new mongoose.Schema({
  userID: String,
  name: String,
  password: String,
  email: String,
  phone: String,
  messages: [messageSchema],
});

module.exports = mongoose.model("User", userSchema);
