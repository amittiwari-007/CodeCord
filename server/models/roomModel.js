const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomId: { type: String, unique: [true, "Room Name should be unique"] },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: [true, "This participant already exists."],
      },
    ],
    hasStarted:{
      type:Boolean,
      default:false
    },

    settings: {
      roomType: {
        type: String,
        default: "default",
        enum: ["Default", "Contest"],
      },
      participantsLimit: {
        type: Number,
        default: 10,
        enum: [10, 20, 50],
      },
      timeLimit: {
        type: Number,
        min: 10,
        default: 40,
        max: 120,
      },
      visibility: {
        type: String,
        default: "public",
        enum: ["public", "private"],
      },
      problems: { type: [Number], default: [1, 2, 3, 4] },
    },
    expiresAt: String,
  },
  { timestamps: true }
);

// Create a TTL index on the `updatedAt` field that expires documents with an empty `participants` array
roomSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { participants: { $size: 0 } } });

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
