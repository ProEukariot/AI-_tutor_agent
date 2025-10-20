import React, { useState } from 'react'

function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  return (
    <div className="message-input">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="message-field"
          />
          <button type="submit" className="send-button">
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default MessageInput
