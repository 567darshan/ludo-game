import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    roomCode: { type: String, required: true },
    players: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
        color: String
      }
    ],
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    startedAt: { type: Date, default: Date.now },
    finishedAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("Game", gameSchema);
