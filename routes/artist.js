const express = require("express");
const router = express.Router();
const Artist = require("../models/artist");
const Album = require("../models/album");
const Track = require("../models/track");
const btoa = require("btoa");

router.get("/", async (req, res) => {
  const artists = await Artist.find();
  if (artists) {
    res.status(200).json(artists);
  } else {
    res.status(404).send("Not Found");
  }
});

router.get("/:artist_id", async (req, res) => {
  const artist = await Artist.findById(req.params.artist_id);
  if (artist) {
    res.status(200).json(artist);
  } else {
    res.status(404).send("Not Found");
  }
});

router.get("/:artist_id/albums", async (req, res) => {
  const albums = await Album.find({ artist_id: req.params.artist_id });
  if (albums) {
    res.status(200).json(albums);
  } else {
    res.status(404).send("Not Found");
  }
});

router.get("/:artist_id/tracks", async (req, res) => {
  const albums_id = [];
  const albums = await Album.find({ artist_id: req.params.artist_id });
  if (!albums) {
    res.status(404).send("Not Found");
  } else {
    albums.forEach((album) => {
      albums_id.push(album._id);
    });

    const tracks = await Track.find({ album_id: { $in: albums_id } });
    res.status(200).json(tracks);
  }
});

router.post("/", async (req, res) => {
  if (typeof req.body.name != "string" || typeof req.body.age != "number") {
    res.status(400).send("Bad Request");
  } else {
    const artist = await Artist.findById(btoa(req.body.name).slice(0, 22));
    if (artist) {
      res.status(409).json(artist);
    } else {
      const artist = new Artist({
        _id: btoa(req.body.name).slice(0, 22),
        name: req.body.name,
        age: req.body.age,
        albums: "/artists/" + btoa(req.body.name).slice(0, 22) + "/albums",
        tracks: "/artists/" + btoa(req.body.name).slice(0, 22) + "/tracks",
        self: "/artists/" + btoa(req.body.name).slice(0, 22),
      });
      await artist.save();
      res.status(201).json(artist);
    }
  }
});

router.post("/:artist_id/albums", async (req, res) => {
  if (typeof req.body.name != "string" || typeof req.body.genre != "string") {
    res.status(400).send("Bad Request");
  } else {
    const artist = await Artist.findById(req.params.artist_id);
    if (!artist) {
      res.status(422).send("Unprocessable Entity");
    } else {
      const album = await Album.findById(
        btoa(req.body.name + ":" + req.params.artist_id).slice(0, 22)
      );
      if (album) {
        res.status(409).json(album);
      } else {
        album = new Album({
          _id: btoa(req.body.name + ":" + req.params.artist_id).slice(0, 22),
          artist_id: req.params.artist_id,
          name: req.body.name,
          genre: req.body.genre,
          artist: "/artists/" + req.params.artist_id,
          tracks:
            "/albums/" +
            btoa(req.body.name + ":" + req.params.artist_id).slice(0, 22) +
            "/tracks",
          self:
            "/albums/" +
            btoa(req.body.name + ":" + req.params.artist_id).slice(0, 22),
        });
        await album.save();
        res.status(201).json(album);
      }
    }
  }
});

router.put("/:artist_id/albums/play", async (req, res) => {
  const albums_id = [];
  const albums = await Album.find({ artist_id: req.params.artist_id });
  if (!albums) {
    res.status(404).send("Not Found");
  } else {
    albums.forEach((album) => {
      albums_id.push(album._id);
    });
    const tracks = await Track.updateMany(
      { album_id: { $in: albums_id } },
      { $inc: { times_played: 1 } }
    );
    res.status(200).json(tracks);
  }
});

router.delete("/:artist_id", async (req, res) => {
  const artist = await Artist.deleteOne({ _id: req.params.artist_id });
  if (artists) {
    res.status(204).json(artist);
  } else {
    res.status(404).send("Not Found");
  }
});

module.exports = router;
