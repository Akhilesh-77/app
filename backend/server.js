const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// connect to mongo inside docker
mongoose.connect("mongodb://mongo:27017/db");

// SIMPLE SCHEMA
const Msg = mongoose.model("Msg", new mongoose.Schema({
  title: String,
  text: String,
  photo: String   // <-- VERY IMPORTANT
}));

const app = express();

// allow large base64 image uploads
app.use(express.json({ limit: "50mb" }));
app.use(cors());

// GET ALL
app.get("/msg", async (req, res) => {
  res.json(await Msg.find());
});

// SAVE NEW
app.post("/msg", async (req, res) => {
  await Msg.create(req.body);
  res.json({ ok: 1 });
});

// DELETE
app.delete("/msg/:id", async (req, res) => {
  await Msg.findByIdAndDelete(req.params.id);
  res.json({ ok: 1 });
});

app.listen(5000, () => console.log("Backend running on 5000"));
