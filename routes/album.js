const express = require("express");
const router = express.Router();
const Album = require("../models/album");
const Track = require("../models/track");
const btoa = require("btoa");

router.get("/", async (req, res) => {
  const albums = await Album.find();
  if (albums) {
    res.status(200).json(albums);
  } else {
    res.status(404).send("Not Found");
  }
});

router.get("/:album_id", async (req, res) => {
  const album = await Album.findById(req.params.album_id);
  if (album) {
    res.status(200).json(album);
  } else {
    res.status(404).send("Not found");
  }
});

router.get("/:album_id/tracks", async (req, res) => {
  const tracks = await Track.find({ album_id: req.params.album_id });
  if (tracks.length !== 0) {
    res.status(200).json(tracks);
  } else {
    res.status(404).send("Not found");
  }
});

router.post("/:album_id/tracks", async (req, res) => {
  const album = await Album.findById(req.params.album_id);
  if (!album) {
    res.status(422).send("Unprocessable Entity");
  } else {
    if (
      typeof req.body.name != "string" ||
      typeof req.body.duration != "number"
    ) {
      res.status(400).send("Bad Request");
    } else {
      const track = await Track.findById(
        btoa(req.body.name + ":" + req.params.album_id).slice(0, 22)
      );
      if (track) {
        res.status(409).json(track);
      } else {
        const album = await Album.findById(req.params.album_id);
        if (!album) {
          res.status(422).send("Unprocessable Entity");
        } else {
          const track = new Track({
            _id: btoa(req.body.name + ":" + req.params.album_id).slice(0, 22),
            album_id: req.params.album_id,
            name: req.body.name,
            duration: req.body.duration,
            times_played: 0,
            artist: "http://localhost:3000/artists/" + album.artist_id,
            album: "http://localhost:3000/albums/" + req.params.album_id,
            self:
              "http://localhost:3000/tracks/" +
              btoa(req.body.name + ":" + req.params.album_id).slice(0, 22),
          });
          await track.save();
          response = {
            name: req.body.name,
            duration: req.body.duration,
            times_played: 0,
            artist: "http://localhost:3000/artists/" + album.artist_id,
            album: "http://localhost:3000/albums/" + req.params.album_id,
            self:
              "http://localhost:3000/tracks/" +
              btoa(req.body.name + ":" + req.params.album_id).slice(0, 22),
          };
          res.status(201).send(response);
        }
      }
    }
  }
});

router.put("/:album_id/tracks/play", async (req, res) => {
  const tracks = await Track.updateMany(
    { album_id: req.params.album_id },
    { $inc: { times_played: 1 } }
  );
  if (tracks) {
    res.status(200).json(tracks);
  } else {
    res.status(404).send("Not Found");
  }
});

router.delete("/:album_id", async (req, res) => {
  const album = await Album.findById(req.params.album_id);
  if (album) {
    await Album.deleteOne({ _id: req.params.album_id });
    res.status(204).json(album);
  } else {
    res.status(404).send("Not Found");
  }
});

module.exports = router;
