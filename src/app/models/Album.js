const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Album = new Schema(
  {
    artists: {
      type: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
      required: true,
      validate: [arrayLimit, "Song must have at least one artist"],
    },
    image: { type: String },
    interested: { type: Number, min: 0 },
    releaseDate: { type: String },
    title: { type: String },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val) {
  return val.length > 0;
}

module.exports = mongoose.model("Album", Album);
