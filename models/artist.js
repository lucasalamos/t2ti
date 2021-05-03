const mongoose = require("mongoose");

const artistSchema = mongoose.Schema({
  _id: String,
  name: String,
  age: Number,
  albums: String,
  tracks: String,
  self: String,
});

module.exports = mongoose.model("Artists", artistSchema);
