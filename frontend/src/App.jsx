import React, { useState, useEffect } from 'react'
import ChatArea from './components/ChatArea'
import FileUpload from './components/FileUpload'
import MessageInput from './components/MessageInput'
import DarkModeToggle from './components/DarkModeToggle'

function App() {
  // Get conversation_id from URL parameters or generate a default one
  const urlParams = new URLSearchParams(window.location.search)
  let conversationId = urlParams.get('conversation_id')
  
  // If no conversation_id provided, generate a unique default one
  if (!conversationId) {
    conversationId = `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    // Update the URL to include the generated conversation_id
    const newUrl = new URL(window.location)
    newUrl.searchParams.set('conversation_id', conversationId)
    window.history.replaceState({}, '', newUrl)
  }
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
      // Prepare message history for backend
      const messageHistory = messages.map(msg => ({
        text: msg.text,
        sender: msg.sender
      }))
      
      const response = await fetch(`http://localhost:8000/${conversationId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: messageHistory }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from server')
      }

      // Remove loading message
      setMessages(prev => prev.filter(msg => msg.id !== loadingMessage.id))

      // Handle streaming response
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let messageContents = [] // Store all message contents
      
      const aiResponse = {
        id: Date.now() + 2,
        text: 'Processing your request...',
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])

      // Function to get status message based on node
      const getStatusMessage = (node) => {
        switch (node) {
          case 'tutor':
            return 'Generating response...'
          case 'reflection':
            return 'Refining answer...'
          case 'tutor_llm':
            return 'Thinking about your question...'
          case 'tool_node':
            return 'Searching knowledge base...'
          case 'reflection_llm':
            return 'Reviewing response quality...'
          default:
            return 'Processing...'
        }
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Decode the chunk and add to buffer
        buffer += decoder.decode(value, { stream: true })
        
        // Process complete lines
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (line.trim() === '') continue // Skip empty lines
          
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim()
            
            if (data === '[DONE]') {
              console.log('Stream completed')
              // Show the second-to-last message content (previous one)
              const finalContent = messageContents.length >= 2 
                ? messageContents[messageContents.length - 2] 
                : messageContents[messageContents.length - 1] || 'Response complete!'
              
              setMessages(prev => 
                prev.map(msg => 
                  msg.id === aiResponse.id 
                    ? { ...msg, text: finalContent }
                    : msg
                )
              )
              return
            }
            
            try {
              const parsed = JSON.parse(data)
              console.log('Received chunk:', parsed)
              
              if (parsed.node) {
                const statusMessage = getStatusMessage(parsed.node)
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === aiResponse.id 
                      ? { ...msg, text: statusMessage }
                      : msg
                  )
                )
              }
              
              // Capture the content for final display
              if (parsed.content) {
                messageContents.push(parsed.content)
              }
            } catch (e) {
              console.error('Error parsing streaming data:', e, 'Data:', data)
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
