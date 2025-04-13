const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Song = new Schema(
  {
    album: { type: Schema.Types.ObjectId, ref: "Album" },
    artists: {
      type: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
    },
    duration: { type: Number, min: 0 },
    image: { type: String },
    interested: { type: Number, min: 0 },
    source: { type: String, required: true },
    title: { type: String, required: true },
    releaseDate: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Song", Song);
