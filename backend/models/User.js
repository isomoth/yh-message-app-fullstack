import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  username: {
    
    //sr-2 string räcker för datatyper ingen åtgärd behöv
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    // SR-1: maxlength tillagd
    maxlength: 50,
    trim: true,
    // SR-3: regex för att tillåta endast alfanumeriska tecken, understreck och bindestreck
    match: /^[a-zA-Z0-9_-]+$/,
  }, 
  email: {
    // SR-3  se ovan
    //sr-2 string räcker för datatyper ingen åtgärd behövs
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    // SR-1: maxlength tillagd
    maxlength: 254, 
  },
  password: {
    // SR-3 
     //sr-2 string räcker för datatyper ingen åtgärd behöv
    type: String,
    required: true,
    // SR-1: maxlength tillagd
    maxlength: 128,
  
  },
})

export const User = mongoose.model("User", userSchema)
