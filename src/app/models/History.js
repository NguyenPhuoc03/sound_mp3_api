const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const History = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    song: { type: Schema.Types.ObjectId, ref: "Song", required: true },
    listenedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("History", History);
