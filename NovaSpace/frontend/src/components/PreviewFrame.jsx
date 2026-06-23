import { useRef, useState, useEffect } from 'react'

export default function PreviewFrame({ previewUrl }) {
  const iframeRef = useRef(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)

  const handleRefresh = () => {
    setLoading(true)
    setIsReady(false)
    setRefreshKey(k => k + 1)
  }

  useEffect(() => {
    if (!previewUrl) return
    let active = true
    let timeoutId
    let attempts = 0

    const checkReady = async () => {
      try {
        // Use mode: 'no-cors' so that cross-origin request doesn't fail due to CORS
        // when checking if the socket/server is up and ready.
        await fetch(previewUrl, { mode: 'no-cors' })
        if (active) {
          setIsReady(true)
          setLoading(false)
        }
      } catch (err) {
        if (active) {
          attempts++
          if (attempts >= 4) {
            // Failsafe: mount the iframe anyway after 6 seconds of failures
            setIsReady(true)
            setLoading(false)
          } else {
            timeoutId = setTimeout(checkReady, 1500)
          }
        }
      }
    }

    setIsReady(false)
    setLoading(true)
    checkReady()

    return () => {
      active = false
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [previewUrl, refreshKey])

  return (
    <div className="flex flex-col h-full w-full transition-smooth">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 shrink-0 transition-smooth"
        style={{
          height: '44px',
          background: 'linear-gradient(135deg, var(--bg-base) 0%, rgba(21,21,40,0.6) 100%)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(10px)'
        }}>

        {/* Traffic light dots */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full transition-smooth hover:scale-110" style={{ background: 'var(--error)', opacity: 0.7 }} />
          <div className="w-3 h-3 rounded-full transition-smooth hover:scale-110" style={{ background: 'var(--warning)', opacity: 0.7 }} />
          <div className="w-3 h-3 rounded-full transition-smooth hover:scale-110" style={{ background: 'var(--success)', opacity: 0.7 }} />
        </div>

        {/* URL bar */}
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg transition-smooth hover-glow"
          style={{
            background: 'rgba(6, 182, 212, 0.05)',
            border: '1px solid var(--border-light)',
            fontSize: '11px',
            fontFamily: 'monospace'
          }}>
          {loading && (
            <div className="w-3 h-3 rounded-full border border-t-transparent shrink-0 animate-spin"
              style={{ borderColor: 'var(--accent-light)', borderTopColor: 'transparent' }} />
          )}
          <span className="truncate font-mono" style={{ color: 'var(--text-tertiary)' }}>
            {previewUrl}
          </span>
        </div>

        {/* Refresh */}
        <button onClick={handleRefresh}
          className="p-2 rounded-lg transition-smooth cursor-pointer group"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--accent-light)'
            e.currentTarget.style.background = 'var(--accent-glow)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--text-tertiary)'
            e.currentTarget.style.background = 'transparent'
          }}
          title="Refresh preview">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>

        {/* Open in new tab */}
        <a href={previewUrl} target="_blank" rel="noreferrer"
          className="p-2 rounded-lg transition-smooth cursor-pointer group"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--accent-light)'
            e.currentTarget.style.background = 'var(--accent-glow)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--text-tertiary)'
            e.currentTarget.style.background = 'transparent'
          }}
          title="Open in new tab">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      {/* iFrame */}
      <div className="flex-1 relative transition-smooth">
        {isReady ? (
          <iframe
            key={refreshKey}
            ref={iframeRef}
            src={previewUrl}
            className="w-full h-full border-0"
            style={{ background: '#fff' }}
            title="Sandbox Preview"
            onLoad={() => setLoading(false)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 transition-smooth animate-fadeIn"
            style={{ background: 'var(--bg-base)' }}>
            <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--accent-light)', borderTopColor: 'transparent' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Starting preview server...
            </span>
          </div>
        )}
      </div>
    </div>
  )
}