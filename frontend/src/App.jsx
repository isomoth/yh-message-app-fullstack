import { useState, useEffect } from "react"
import { BASE_URL } from "./api"
import { PostMessage } from "./components/PostMessage"
import { MessageList } from "./components/MessageList"
import { AuthModal } from "./components/AuthModal"

export const App = () => {
  const [loading, setLoading] = useState(false)
  const [messageList, setMessageList] = useState([])
  const [user, setUser] = useState(null)
  const [modal, setModal] = useState(null)
  const [error, setError] = useState(null)

  const fetchPosts = () => {
    setLoading(true)
    fetch(`${BASE_URL}/messages`)
      .then((res) => res.json())
      .then((data) => setMessageList(data))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false))
  }
  useEffect(() => {
    fetchPosts()
  }, [])

    const addNewPost = (newMessage) => {
    setMessageList([newMessage, ...messageList])
  }

  const handleUnauthorized = () => {
    setUser(null)
    setError("Your session has expired, please log in again")
  }
    
  return (
    <>
        {user ? (
          <div className="user-info">
            <span>{user.response.username}</span>
            <button
              onClick={() => setUser(null)}
              className="auth-button"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button
              onClick={() => setModal("login")}
              className="auth-button"
            >
              Login
            </button>
            <button
              onClick={() => setModal("register")}
              className="auth-button"
            >
              Register
            </button>
          </div>
        )}
      {modal && (
        <AuthModal
          mode={modal}
          onClose={() => setModal(null)}
          onSuccess={(data) => { 
            // Övrig finding: Tog bort console.log som visade AccessToken i dev tools. Nu loggas inte auth-responsen här heller.
            setUser(data) 
            setModal(null) 
          }}
        />
      )}
      {error && <p className="error">{error}</p>}
      <PostMessage newMessage={addNewPost} fetchPosts={fetchPosts} user={user} onUnauthorized={handleUnauthorized} />
      <MessageList
        loading={loading}
        messageList={messageList}
        setMessageList={setMessageList}
        fetchPosts={fetchPosts}
        user={user}
        onUnauthorized={handleUnauthorized}
      />
    </>
  )
}
