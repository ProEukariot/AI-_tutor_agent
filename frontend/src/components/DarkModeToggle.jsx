import React from 'react'

function DarkModeToggle({ isDarkMode, onToggle }) {
  return (
    <button 
      className={`dark-mode-toggle ${isDarkMode ? 'dark' : 'light'}`}
      onClick={onToggle}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  )
}

export default DarkModeToggle
