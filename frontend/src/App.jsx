import React, { useState, useEffect } from 'react'
import ChatArea from './components/ChatArea'
import FileUpload from './components/FileUpload'
import MessageInput from './components/MessageInput'
import DarkModeToggle from './components/DarkModeToggle'

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])

  // Dark mode state with system preference detection
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check system preference on initial load
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return true
    }
    return false
  })

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      setIsDarkMode(e.matches)
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const handleSendMessage = (messageText) => {
    const newMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: "I received your message: " + messageText,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const handleFileUpload = (files) => {
    console.log('Files uploaded:', files)
    // Handle file upload logic here
  }

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="chat-container">
        <div className="chat-main">
          <div className="chat-header">
            <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
          </div>
          <ChatArea messages={messages} />
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
        <div className="file-upload-area">
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
      </div>
    </div>
  )
}

export default App
