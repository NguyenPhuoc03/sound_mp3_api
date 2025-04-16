const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    likedArtists: {
      type: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
      default: [],
    },
    likedSongs: {
      type: [{ type: Schema.Types.ObjectId, ref: "Song" }],
      default: [],
    },
    premium: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", User);
