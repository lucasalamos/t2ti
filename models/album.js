const mongoose = require("mongoose");

const albumSchema = mongoose.Schema({
  _id: String,
  artist_id: String,
  name: String,
  genre: String,
  artist: String,
  tracks: String,
  self: String,
});

module.exports = mongoose.model("Albums", albumSchema);
