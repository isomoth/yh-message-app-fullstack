import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
  message: {
   //SR-2 string räcker för datatyper- ingen åtgärd
    type: String,
    required: true
     // SR-1, maxlenght,minlengt och trimma mellanslag tillagd
    minLength: 1,
    maxLength: 500,
    trim: true,

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
