const mongoose = require("mongoose");

const trackSchema = mongoose.Schema({
  _id: String,
  album_id: String,
  name: String,
  duration: Number, //Arreglar esto
  times_played: Number,
  artist: String,
  album: String,
  self: String,
});

module.exports = mongoose.model("Tracks", trackSchema);
