import React, { useState, useRef } from 'react'

function FileUpload({ onFileUpload }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }

  const handleFiles = async (files) => {
    // Filter for PDF files only (as per backend API)
    const pdfFiles = files.filter(file => file.type === 'application/pdf')
    
    if (pdfFiles.length === 0) {
      setUploadStatus({ type: 'error', message: 'Please upload PDF files only' })
      return
    }

    if (pdfFiles.length !== files.length) {
      setUploadStatus({ type: 'warning', message: 'Only PDF files are supported. Other files were ignored.' })
    }

    const newFiles = pdfFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }))
    
    setUploadedFiles(prev => [...prev, ...newFiles])
    
    // Upload files to backend
    await uploadFilesToBackend(pdfFiles)
  }

  const uploadFilesToBackend = async (files) => {
    setIsUploading(true)
    setUploadStatus({ type: 'uploading', message: 'Uploading files...' })

    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const response = await fetch(`${backendUrl}/123/upload-documents`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      setUploadStatus({ 
        type: 'success', 
        message: `Successfully uploaded ${result.files} file(s)` 
      })
      
      // Call the parent callback
      onFileUpload(files)

    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus({ 
        type: 'error', 
        message: `Upload failed: ${error.message}` 
      })
    } finally {
      setIsUploading(false)
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setUploadStatus(null)
      }, 5000)
    }
  }

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="file-upload">
      <h3>File Upload</h3>
      
      <div
        className={`drop-zone ${isDragOver ? 'drag-over' : ''} ${isUploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <div className="drop-zone-content">
          {isUploading ? (
            <>
              <div className="upload-spinner"></div>
              <p>Uploading files...</p>
            </>
          ) : (
            <>
              <div className="upload-icon">📁</div>
              <p>Drag and drop PDF files here</p>
              <p className="or-text">or click to browse</p>
            </>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,application/pdf"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={isUploading}
      />

      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h4>Uploaded Files:</h4>
          {uploadedFiles.map((file) => (
            <div key={file.id} className="file-item">
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{formatFileSize(file.size)}</span>
              </div>
              <button
                className="remove-file"
                onClick={() => removeFile(file.id)}
                disabled={isUploading}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Status Indicator */}
      {uploadStatus && (
        <div className={`upload-status ${uploadStatus.type}`}>
          {uploadStatus.type === 'uploading' && <div className="status-spinner"></div>}
          <span className="status-message">{uploadStatus.message}</span>
        </div>
      )}
    </div>
  )
}

export default FileUpload
