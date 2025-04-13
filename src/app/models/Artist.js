const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Artist = new Schema(
  {
    avatar: { type: String, required: true },
    interested: { type: Number, min: 0 },
    name: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Artist", Artist);
