import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  username: {
    //sr-2 string räcker för datatyper- ingen åtgärd
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    // SR-1: maxlength tillagd
    maxlength: 50,
    trim: true,
    // SR-3: regex tillagd, för att tillåta endast alfanumeriska tecken, understreck och bindestreck, användarnamn behöver inte inhålla htmltaggar och specialtecken som <, >, &, etc.
    match: /^[a-zA-Z0-9_-]+$/
  }, 
  email: {
   //sr-2 string räcker för datatyper- ingen åtgärd 
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    // SR-1: maxlength tillagd
    maxlength: 254, 
  },
  password: {
     //sr-2 string räcker för datatyper- ingen åtgärd 
    type: String,
    required: true,
    maxlength: 128,
  
  },
})

export const User = mongoose.model("User", userSchema)
