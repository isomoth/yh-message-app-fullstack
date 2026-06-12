import "dotenv/config"
import helmet from "helmet"
import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Message } from "./models/Message.js"
import { User } from "./models/User.js"
import { authenticateUser } from "./middleware/auth.js"
import "./config/db.js"
import listEndpoints from "express-list-endpoints"
import { rateLimit } from 'express-rate-limit'

// Antalet inloggningsförsök behövde begränsas enligt våra övriga findings, vilket vi har hanterat genom express-rate-limit. 

// Godkända domäner för CORS
const ALLOWED_ORIGINS = "http://localhost:5500";

// Konfiguration för express-rate-limit
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 10, // Låg gräns för att undvika för många anrop till inloggningsförsök. Man skulle behöva skapa enskilda limiters för varje anrop för att undvika låga värden hos exempelvis app.get("/messages"...)
	standardHeaders: 'draft-8', 
	legacyHeaders: false,
	ipv6Subnet: 56,
})

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set in .env")

const PORT = process.env.PORT || "3000"
const app = express()
app.use(helmet())
app.use(cors({
  origin: ALLOWED_ORIGINS, //Övrig finding: CORS-policy var för generös, vi har ändrat det till att endast tillåta specifika domäner/frontend-origin
}))
app.use(express.json(), limiter)

app.get("/", (req, res) => {
  res.send(listEndpoints(app))
})

app.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body
    // SR-3: Validering av användarnamn, för att säkerställa att det inte innehåller otillåtna tecken. Evt. regex eller liknande. Användarnamn behöver inte innehålla htmltaggar och specialtecken som <, >, &, etc.
    // Möjlig lösning (kan testas med egen deployad backend/databas):
    // const usernameRegex = /^[a-zA-Z0-9_-]+$/
    // if (!usernameRegex.test(username)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Username contains invalid characters"
    //   })
    // }
    if (!username || username.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Username must be at least 2 characters" })
    }
    // sr-1: maxlängd tillagd och felmeddelande för detta
    if (username.trim().length > 50) {
      return res.status(400).json({ success: false, message: "Username must be 50 characters or less" })
    }
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.trim() }]
    })

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? "email" : "username"
      return res.status(400).json({
        success: false,
        message: `A user with this ${field} already exists`
      })
    }
    // SR-9. Kravet uppfylls, lösenord sparas inte i klartext
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ username: username.trim(), email, password: hashedPassword })
    await user.save()

    const accessToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      // Övrig finding: Token-expiration är för lång, ändrat till 30 minuter
      { expiresIn: "30m" }
    )

    res.status(201).json({
      success: true,
      message: "User created successfully",
      response: {
        username: user.username,
        id: user._id,
        accessToken,
      },
    })
  } catch (error) {
    // Övrig finding: Loggar felet internt på servern men skickar bara ett generiskt felmeddelande till klienten.
    console.error(error)
    res.status(400).json({
      success: false,
      message: "Could not create user",
    })
  }
})

app.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body
    const user = await User.findOne({
      $or: [{ username: login }, { email: login }]
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No account found with that username or email",
        response: null,
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        // SR-4: Meddelandet är nu generiskt och avslöjar inte vilken inloggningsuppgift som är fel
        message: "Username or password is incorrect",
        response: null,
      })
    }

    const accessToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      // Övrig finding: Token-expiration var för lång, ändrade till 30 minuter.
      { expiresIn: "30m" }
    )

    res.json({
      success: true,
      message: "Logged in successfully",
      response: {
        username: user.username,
        id: user._id,
        accessToken,
      },
    })
  } catch (error) {
    // Övrig finding: Loggar felet internt på servern men skickar bara ett generiskt felmeddelande till klienten.
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    })
  }
})

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: "desc" })
      .limit(20)
      .populate("user", "username")
      .exec()
    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: "Could not fetch messages" })
  }
})
// SR-8: Kravet uppfylls när det gäller att skapa ett meddelande
app.post("/messages", authenticateUser, async (req, res) => {
  const message = new Message({ message: req.body.message, user: req.user._id })
  try {
    const saved = await message.save()
    res.status(201).json(saved)
  } catch (err) {
    // Övrig finding: Tog bort intern valideringsinfo från klientsvaret för att inte läcka databasdetaljer.
    console.error(err)
    res.status(400).json({ message: "Could not save message" })
  }
})

app.patch("/messages/:id", authenticateUser, async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: "Invalid message ID" })
  try {
    const message = await Message.findById(req.params.id)
    if (!message) return res.status(404).json({ error: "Message not found" })

    if (message.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You can only edit your own messages" })
    }

    message.message = req.body.editedMessage
    await message.save()
    const updated = await message.populate("user", "username")
    res.json(updated)
  } catch (error) {
    res.status(400).json({ error: "Could not update message" })
  }
})
// SR-8: Kravet uppfylldes inte när det gäller att radera ett meddelande. Nu har vi lagt in authenticateUser, men det kvarstår att reproducera med vår egen instans.
app.delete("/messages/:id", authenticateUser, async (req, res) => {
  if (!isValidId(req.params.id)) return res.status(400).json({ error: "Invalid message ID" })
  try {
    const message = await Message.findById(req.params.id)
    if (!message) return res.status(404).json({ error: "Message not found" })
    if (message.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You can only delete your own messages" })
    }
    await message.deleteOne() // Övrig finding: Nu kan inte en inloggad användare radera andras meddelanden - Endast ägaren kan nu radera sitt egna meddelande.
    res.status(204).send()
  } catch (error) {
    res.status(400).json({ error: "Could not delete message" })
  }
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
