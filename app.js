const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dburl =
  "mongodb+srv://lucasdb:lucasdbpassword@cluster0.939ev.mongodb.net/lucasdb?retryWrites=true&w=majority";
const artistsRoute = require("./routes/artist");
const albumsRoute = require("./routes/album");
const tracksRoute = require("./routes/track");

app.use(bodyParser.json());

app.use("/artists", artistsRoute);
app.use("/albums", albumsRoute);
app.use("/tracks", tracksRoute);

app.get("/", (req, res) => {
  res.send("T2 Taller de Integracion \nLucas Alamos Illanes");
});

mongoose.connect(
  dburl,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => app.listen(3000)
);
