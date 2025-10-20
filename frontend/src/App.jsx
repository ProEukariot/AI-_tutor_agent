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

  const handleSendMessage = async (messageText) => {
    const newMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
    
    // Add loading message
    const loadingMessage = {
      id: Date.now() + 1,
      text: "Thinking...",
      sender: 'ai',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, loadingMessage])
    
    try {
      const response = await fetch(`http://localhost:8000/123/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from server')
      }

      // Remove loading message
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id))

      // Handle streaming response
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let aiResponseText = ''
      
      const aiResponse = {
        id: Date.now() + 2,
        text: '',
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              return
            }
            
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                aiResponseText += parsed.content
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === aiResponse.id 
                      ? { ...msg, text: aiResponseText }
                      : msg
                  )
                )
              }
            } catch (e) {
              console.error('Error parsing streaming data:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Remove loading message and show error
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessage.id)
        return [...filtered, {
          id: Date.now() + 3,
          text: "Sorry, I encountered an error. Please try again.",
          sender: 'ai',
          timestamp: new Date()
        }]
      })
    }
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
