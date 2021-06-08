const express = require("express");
const router = express.Router();
const Track = require("../models/track");

router.get("/", async (req, res) => {
  const tracks = await Track.find();
  if (tracks) {
    res.status(200).json(tracks);
  } else {
    res.status(404).send("Not Found");
  }
});

router.get("/:track_id", async (req, res) => {
  const track = await Track.findById(req.params.track_id);
  if (track) {
    res.status(200).json(track);
  } else {
    res.status(404).send("Not Found");
  }
});

router.put("/:track_id/play", async (req, res) => {
  const track = await Track.updateOne(
    { _id: req.params.track_id },
    { $inc: { times_played: 1 } }
  );
  if (track) {
    res.status(200).json(track);
  } else {
    res.status(404).send("Not Found");
  }
});

router.delete("/:track_id", async (req, res) => {
  const track = await Track.findById(req.params.track_id);

  if (track) {
    await Track.deleteOne({ _id: req.params.track_id });
    res.status(204).json(track);
  } else {
    res.status(404).send("Not Found");
  }
});

module.exports = router;
