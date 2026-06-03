import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
  message: {
    // SR-1 , maxlenght och minlengt och trimma mellanslag
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const Message = mongoose.model("Message", messageSchema)
