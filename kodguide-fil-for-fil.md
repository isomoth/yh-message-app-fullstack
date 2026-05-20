# Kodguide fil for fil (nyborjarniva)

## Backend

### backend/package.json

Vad filen gör:
- Beskriver backend-projektet, dependencies och npm-skript.

Exempel:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```
- `npm run start` startar servern normalt.
- `npm run dev` startar med nodemon (auto-omstart vid ändringar).

---

### backend/config/db.js

Vad filen gör:
- Kopplar backend till MongoDB med Mongoose.
- Loggar när anslutningen fungerar eller ger fel.

Exempel:
```js
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/messages"
mongoose.connect(mongoUrl)
```
- Hämtar databas-URL fran environment-variabel.

---

### backend/models/User.js

Vad filen gor:
- Definierar hur en användare sparas i databasen.
- Skapar modellen `User` som kan användas i serverkoden.

Exempel:
```js
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})
```
- Beskriver vilka fält som finns på en användare.

---

### backend/models/Message.js

Vad filen gör:
- Definierar hur ett meddelande sparas i databasen.
- Kopplar varje meddelande till en användare.

Exempel:
```js
const messageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
})
```
- `user` pekar på ett dokument i `User`-samlingen.

---

### backend/middleware/auth.js

Vad filen gör:
- Är middleware som kontrollerar JWT-token.
- Om token är giltig läggs användaren in i `req.user`.
- Om token saknas eller är felaktig skickas 401-svar.

Exempel:
```js
const token = req.headers.authorization?.replace("Bearer ", "")
const decoded = jwt.verify(token, process.env.JWT_SECRET)
const user = await User.findById(decoded.userId)
req.user = user
next()
```
- Middleware körs innan skyddade endpoints (till exempel skapa meddelande).

---

### backend/server.js

Vad filen gör:
- Är huvudfilen för backend.
- Startar Express-servern.
- Definierar API-routes for registrering, inloggning och meddelanden.

Viktiga delar:

1. Grundinstallation av servern
```js
const app = express()
app.use(helmet())
app.use(cors({ origin: "*" }))
app.use(express.json())
```
- Aktiverar middleware och JSON-hantering.

2. Registrering (`POST /register`)
```js
const hashedPassword = await bcrypt.hash(password, 10)
const user = new User({ username: username.trim(), email, password: hashedPassword })
await user.save()
```
- Skapar ny användare och sparar i databasen.

3. Inloggning (`POST /login`)
```js
const user = await User.findOne({ $or: [{ username: login }, { email: login }] })
const passwordMatch = await bcrypt.compare(password, user.password)
```
- Hittar användare och jämför lösenord.

4. Hämta meddelanden (`GET /messages`)
```js
const messages = await Message.find()
  .sort({ createdAt: "desc" })
  .limit(20)
  .populate("user", "username")
```
- Hämtar de senaste meddelandena och fyller på användarnamn.

5. Skapa meddelande (`POST /messages`)
```js
const message = new Message({ message: req.body.message, user: req.user._id })
const saved = await message.save()
```
- Skapar nytt meddelande för inloggad användare.

6. Redigera meddelande (`PATCH /messages/:id`)
```js
message.message = req.body.editedMessage
await message.save()
```
- Uppdaterar texten i ett befintligt meddelande.

7. Radera meddelande (`DELETE /messages/:id`)
```js
await message.deleteOne()
res.status(204).send()
```
- Tar bort ett meddelande.

8. Starta servern
```js
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
```

---

## Frontend

### frontend/package.json

Vad filen gör:
- Beskriver frontend-projektet och dess scripts.

Exempel:
```json
"scripts": {
  "dev": "vite --host",
  "build": "vite build",
  "preview": "vite preview"
}
```
- `npm run dev` startar frontend lokalt med hjälp av Vite.

---

### frontend/vite.config.js

Vad filen gör:
- Vite-konfiguration för React.

Exempel:
```js
export default defineConfig({
  plugins: [react()],
})
```
- Lägger till React-plugin i byggverktyget.

---

### frontend/index.html

Vad filen gör:
- Är HTML-skalet som React-appen monteras in i.

Exempel:
```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```
- `root` är platsen där React renderar allt innehåll.

---

### frontend/src/main.jsx

Vad filen gör:
- Är frontendens startpunkt i React.
- Renderar komponenten `App` i `#root`.

Exempel:
```jsx
createRoot(document.getElementById("root")).render(<App />)
```

---

### frontend/src/api.js

Vad filen gör:
- Innehåller bas-URL till backend.

Exempel:
```js
export const BASE_URL = "https://yh-message-app-fullstack.onrender.com"
```
- Andra filer importerar denna konstant när de anropar API.

---

### frontend/src/App.jsx

Vad filen gör:
- Är huvudkomponenten i frontend.
- Håller globalt state/minne (meddelanden, inloggad användare, modal, fel).
- Hämtar meddelanden och visar underkomponenter.

Exempel på state/minne:
```jsx
const [messageList, setMessageList] = useState([])
const [user, setUser] = useState(null)
const [modal, setModal] = useState(null)
```

Exempel på datainhämtning:
```jsx
fetch(`${BASE_URL}/messages`)
  .then((res) => res.json())
  .then((data) => setMessageList(data))
```

Exempel på rendering:
```jsx
<PostMessage newMessage={addNewPost} fetchPosts={fetchPosts} user={user} />
<MessageList loading={loading} messageList={messageList} user={user} />
```

---

### frontend/src/components/AuthModal.jsx

Vad filen gör:
- Visar formuläret för login eller registrering i en modal.
- Skickar `POST /login` eller `POST /register` beroende på läge.

Exempel:
```js
const url = mode === "register" ? `${BASE_URL}/register` : `${BASE_URL}/login`
const body = mode === "register" ? { username, email, password } : { login, password }
```
- Samma komponent återanvänds för båda fallen.

---

### frontend/src/components/PostMessage.jsx

Vad filen gör:
- Visar formuläret för att skapa nytt meddelande.
- Skickar `POST /messages` med token i header.
- Uppdaterar listan när meddelandet är skickat.

Exempel:
```js
const res = await fetch(`${BASE_URL}/messages`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.response?.accessToken}`,
  },
  body: JSON.stringify({ message: newPost }),
})
```

---

### frontend/src/components/MessageList.jsx

Vad filen gör:
- Tar emot listan av meddelanden som props.
- Renderar en `SingleMessage` per meddelande.
- Visar spinner under laddning.

Exempel:
```jsx
{messageList.map((message) => (
  <SingleMessage key={message._id} message={message} user={user} />
))}
```

---

### frontend/src/components/SingleMessage.jsx

Vad filen gör:
- Visar ett enskilt meddelande.
- Hanterar redigering och radering av meddelandet.
- Skickar `PATCH` och `DELETE` till backend.

Exempel på radering:
```js
await fetch(`${BASE_URL}/messages/${message._id}`, {
  method: "DELETE",
  headers: { Authorization: `Bearer ${user?.response?.accessToken}` },
})
```

Exempel på redigering:
```js
await fetch(`${BASE_URL}/messages/${message._id}`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.response?.accessToken}`,
  },
  body: JSON.stringify({ editedMessage: editedText }),
})
```

---

### frontend/index.css

Vad filen gör:
- Innehåller appens CSS styling

Exempel:
```css
.message {
  border: 2px solid #7e7e7e;
  box-shadow: 7px 7px;
}
```
- Definierar utseende för en meddelanderuta.

---
