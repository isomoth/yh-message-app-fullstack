import mongoose from "mongoose"

// SR-10: Kravet uppfylls. Databasen går bara att nå lokalt med localhost och via backend, och MONGO_URL är inte hårdkodad, utan hämtas från .env
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/messages"

mongoose.connect(mongoUrl)

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB")
})

mongoose.connection.on("error", err => {
  console.error("connection error:", err)
})
