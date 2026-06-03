import { useState } from "react"
import { BASE_URL } from "../api"

export const AuthModal = ({ mode, onClose, onSuccess }) => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const url = mode === "register" ? `${BASE_URL}/register` : `${BASE_URL}/login`
      const body = mode === "register"
        ? { username, email, password }
        : { login, password }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Something went wrong")
      console.log("Auth successful:", data) // Övriga findings: Visar AccessToken via dev tools
      onSuccess(data)
    } catch (err) {
      // SR-4: Visar känslig data i felmeddelandet, visas genom dev tools
      console.log(err)
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="auth-form"
      >
        <h2>{mode === "register" ? "Register" : "Login"}</h2>

        {mode === "register" ? (
          <>
            <input
            // SR-2 ingen åtgärd behövd
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              name="username"
              autoComplete="username"
              // maxlength är satt till 25, SR-1
              maxLength={25}
            />
            <input
            // SR-2 ingen åtgärd behövd
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              autoComplete="email"
              // maxlength är satt till 254, SR-1
              maxLength={254}
            />
          </>
        ) : (
          <input
          // SR-2 ingen åtgärd behövd
            type="text"
            placeholder="Username or email"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            name="login"
            autoComplete="username"
            // SR-1, maxLength satt till 254 för att täcka både email och username
            maxLength={254} 
          />
        )}

        <input
        // SR-1 - 3
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          // SR-1, maxLength satt till 128 vilket är en vanlig maxlängd för lösenord
          maxLength={128} 
          name="password"
          // Övriga findings: Visar lösenordet i klartext i HTML via dev tools
          autoComplete={mode === "register" ? "new-password" : "current-password"}
        />

        {error && <p className="error">{error}</p>} {/* Övriga findings: Visar "Password is incorrect" på frontend */}

        <button
          type="submit"
          className="auth-button"
          disabled={submitting}
        >
          {mode === "register" ? "Register" : "Login"}
        </button>
      </form>
    </div>
  )
}
