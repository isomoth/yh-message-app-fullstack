import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  username: {
    // SR 3 ska definieras här (otillåtna tecken) Evtl. med regex/match? 
    // SR-2: Göra research. Räcker det med type: String för att sanera mot otillåtna datatyper?
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    // SR-1: maxlength, lägg till här
    trim: true,
  }, 
  email: {
    // SR-3 och SR-2, se ovan
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    // SR-1: maxlength, lägg till här
  },
  password: {
    // SR-3 och SR-2, se ovan
    type: String,
    required: true,
    // SR-1: maxlength, lägg till här
  },
})

export const User = mongoose.model("User", userSchema)
