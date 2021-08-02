const mongoose = require("mongoose");

const Time = new mongoose.Schema({
  date: { type: Date, required: true },
});

module.exports = mongoose.model("Time", Time);
