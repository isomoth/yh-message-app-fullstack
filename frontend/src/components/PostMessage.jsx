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

      // Övrig finding: Tog bort console.log. Token visas inte längre i dev tools när meddelande skickas.

      if (res.status === 401) {
        onUnauthorized()
        setSubmitting(false)
        return
      }

      const data = await res.json()

      if (data.message && !data._id) {
        // Övrig finding: Tog bort console.log som visade message-objekt inkl. användar- och meddelandeId
        setErrorMessage(data.message) // SR-4: Visar valideringsdetaljer, behöver reproduceras när vår instans är kopplad
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
