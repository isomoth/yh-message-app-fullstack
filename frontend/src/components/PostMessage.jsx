import { useState } from "react"
import { BASE_URL } from "../api"

export const PostMessage = ({ newMessage, fetchPosts, user, onUnauthorized }) => {
  const [newPost, setNewPost] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch(`${BASE_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.response?.accessToken}`,
        },
        body: JSON.stringify({ message: newPost }),
      })

      // Övriga findings: Token visas i dev tools när man skickar ett meddelande
      console.log("Token being sent:", user?.response?.accessToken)

      if (res.status === 401) {
        onUnauthorized()
        setSubmitting(false)
        return
      }

      const data = await res.json()

      if (data.message && !data._id) {
        console.log(data) // Övriga findings: Visar känslig server-respons, behöver reproduceras
        setErrorMessage(data.message) // SR-4: Visar valideringsdetaljer, behöver reproduceras
        setSubmitting(false)
        return
      }

      newMessage(data)
      setNewPost("")
      setErrorMessage("")
      setSubmitting(false)
      await fetchPosts()
    } catch (error) {
      console.error(error)
      setSubmitting(false)
    }
  }

  if (!user) {
    return <p id="login-prompt">Log in to write a message</p>
  }

  return (
    <div id="post-form-wrapper" className="post-wrapper">
      <p>What's making you happy right now?</p>
      <form id="post-form" onSubmit={handleFormSubmit}>
        <textarea
        // SR 1 - 3
          id="post-textarea"
          rows="3"
          placeholder="Write your message here..."
          value={newPost}
          onChange={(e) => {
            setNewPost(e.target.value)
            setErrorMessage("")
          }}
        />
        <p className="error" id="post-error">{errorMessage}</p>
        <button
          type="submit"
          id="submit-post-btn"
          aria-label="button for submitting your post"
          disabled={submitting}
        >
          <span className="emoji">&#x2665;</span>
          Send message
          <span className="emoji">&#x2665;</span>
        </button>
      </form>
    </div>
  )
}
