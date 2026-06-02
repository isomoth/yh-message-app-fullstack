import { useState } from "react"
import { BASE_URL } from "../api"

export const SingleMessage = ({ message, user, onUnauthorized, fetchPosts }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(message.message)
  const [editError, setEditError] = useState("")

  const isOwner = user && user.response.id === message.user?._id

  const onDelete = async () => {
    try {
      const res = await fetch(`${BASE_URL}/messages/${message._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.response?.accessToken}`,
        },
      })

      if (res.status === 401) {
        onUnauthorized()
        return
      }

      await fetchPosts()
    } catch (error) {
      console.error(error)
    }
  }

  const onSave = async () => {
    try {
      const res = await fetch(`${BASE_URL}/messages/${message._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.response?.accessToken}`,
        },
        body: JSON.stringify({ editedMessage: editedText }),
      })

      if (res.status === 401) {
        onUnauthorized()
        return
      }

      const data = await res.json()

      if (data.error) {
        console.log(data) // SR-4: Visar känslig serverresponse, behöver reproduceras
        setEditError(data.error) // SR-4: Visar känslig data på felmeddelandet, behöver reproduceras
        return
      }

      setIsEditing(false)
      setEditError("")
      await fetchPosts()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="message" data-id={message._id}>
      <div className="message-header">
        {!isEditing && <p className="message-text">{message.message}</p>}

        {isEditing && (
          <div className="edit-wrapper">
            <label>
              <textarea
                className="edit-textarea"
                rows="3"
                value={editedText}
                onChange={(event) => {
                  setEditedText(event.target.value)
                  setEditError("")
                }}
              />
              <p className="error edit-error">{editError}</p>
            </label>
          </div>
        )}

        <div className="message-actions">
          <button type="button" className="delete-btn" onClick={onDelete}>🗑️</button>

          {isOwner && !isEditing && (
            <button type="button" className="edit-btn" onClick={() => setIsEditing(true)}>✏️</button>
          )}

          {isOwner && isEditing && (
            <button type="button" className="save-btn" onClick={onSave}>💾</button>
          )}

          {isOwner && isEditing && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setIsEditing(false)
                setEditError("")
              }}
            >
              ❌
            </button>
          )}
        </div>
      </div>

      <div className="info-wrapper">
        <div className="info-user">{message.user?.username || ""}</div>
      </div>
    </div>
  )
}
