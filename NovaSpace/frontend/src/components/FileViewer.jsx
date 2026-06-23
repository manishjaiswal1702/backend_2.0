import { useState, useEffect } from 'react'

const LANGUAGE_MAP = {
  js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
  css: 'css', html: 'html', json: 'json', md: 'markdown',
  py: 'python', sh: 'bash', yml: 'yaml', yaml: 'yaml',
}

function getLanguage(filename) {
  const ext = filename.split('.').pop()?.toLowerCase()
  return LANGUAGE_MAP[ext] || 'plaintext'
}

export default function FileViewer({ agentBase, filePath }) {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!agentBase || !filePath) return
    const fetchFile = async () => {
      setLoading(true)
      setError(null)
      setContent(null)
      try {
        const res = await fetch(`${agentBase}/read-files?files=${encodeURIComponent(filePath)}`)
        const data = await res.json()
        const fileData = data.files?.[0]
        if (fileData) {
          const fileContent = Object.values(fileData)[0]
          setContent(fileContent)
        } else {
          setError('File not found or empty')
        }
      } catch (err) {
        setError('Failed to load file')
      } finally {
        setLoading(false)
      }
    }
    fetchFile()
  }, [agentBase, filePath])

  if (!filePath) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 transition-smooth"
        style={{ color: 'var(--text-muted)', background: 'var(--bg-base)' }}>
        <div className="w-16 h-16 rounded-xl flex items-center justify-center transition-smooth hover:scale-110"
          style={{
            background: 'var(--accent-glow)',
            border: '2px solid var(--accent)'
          }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--accent-light)' }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </div>
        <p className="text-sm font-medium">Select a file from the explorer</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full transition-smooth">
      {/* File tab bar */}
      <div className="flex items-center gap-3 px-4 shrink-0 transition-smooth"
        style={{
          height: '44px',
          background: 'linear-gradient(135deg, var(--bg-base) 0%, rgba(21,21,40,0.6) 100%)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(10px)'
        }}>
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg transition-smooth hover-glow"
          style={{
            background: 'rgba(6, 182, 212, 0.05)',
            border: '1px solid var(--border-light)',
            borderBottom: 'none'
          }}>
          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
            {filePath.split('/').pop()}
          </span>
          <span className="text-xs px-2 py-1 rounded font-medium"
            style={{
              background: 'var(--accent-glow)',
              color: 'var(--accent-light)',
              border: '1px solid var(--accent)'
            }}>
            {getLanguage(filePath)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto relative transition-smooth" style={{ background: 'var(--bg-base)' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--accent-light)', borderTopColor: 'transparent' }} />
          </div>
        )}
        {error && (
          <div className="p-6 text-sm rounded-lg" style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)' }}>
            {error}
          </div>
        )}
        {content !== null && !loading && (
          <pre className="p-6 text-xs leading-relaxed overflow-auto h-full transition-smooth"
            style={{
              color: 'var(--text-secondary)',
              fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              background: 'var(--bg-base)'
            }}>
            <code>{content}</code>
          </pre>
        )}
      </div>
    </div>
  )
}