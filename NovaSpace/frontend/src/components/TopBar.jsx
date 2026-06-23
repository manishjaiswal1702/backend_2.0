import { useState } from 'react'

export default function TopBar({ sandboxId, activeTab, onTabChange, status }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [userMenu, setUserMenu] = useState(false)

  const shortId = sandboxId ? sandboxId.slice(0, 8) + '…' : ''

  const statusConfig = {
    ready: { color: 'var(--success)', label: 'Ready', dot: true },
    loading: { color: 'var(--warning)', label: 'Working…', dot: false },
    error: { color: 'var(--error)', label: 'Error', dot: true },
  }
  const s = statusConfig[status] || statusConfig.ready

  const handleLogin = async () => {
    try {
      // Redirect to Google OAuth or your auth endpoint
      window.location.href = '/api/auth/google'
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      setIsLoggedIn(false)
      setUserMenu(false)
      window.location.href = '/'
    }
  }

  return (
    <header className="flex items-center justify-between px-5 shrink-0 transition-smooth"
      style={{
        height: '56px',
        background: 'linear-gradient(135deg, rgba(21,21,40,0.8), rgba(26,26,46,0.6))',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 40
      }}>

      {/* Left — Logo + sandbox ID */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-smooth hover-glow"
            style={{
              background: 'linear-gradient(135deg, var(--accent-glow), var(--secondary-glow))',
              border: '1.5px solid var(--accent-light)',
              boxShadow: '0 0 16px var(--accent-glow)'
            }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1" fill="var(--accent-light)" />
              <rect x="9" y="1" width="6" height="6" rx="1" fill="var(--accent-light)" opacity="0.4" />
              <rect x="1" y="9" width="6" height="6" rx="1" fill="var(--accent-light)" opacity="0.4" />
              <rect x="9" y="9" width="6" height="6" rx="1" fill="var(--accent-light)" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Sandbox IDE
          </span>
        </div>

        {sandboxId && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-smooth hover-glow"
            style={{
              background: 'var(--accent-glow)',
              border: '1px solid var(--accent)',
              boxShadow: '0 0 12px var(--accent-glow)'
            }}>
            <div className="w-2 h-2 rounded-full animate-glow-pulse" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }} />
            <span className="text-xs font-mono font-medium" style={{ color: 'var(--text-primary)' }}>
              {shortId}
            </span>
          </div>
        )}
      </div>

      {/* Center — Tab switcher */}
      <div className="flex items-center gap-1 p-1.5 rounded-lg transition-smooth"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)' }}>
        {[
          { id: 'preview', icon: '⬛', label: 'Preview' },
          { id: 'files', icon: '📄', label: 'Files' }
        ].map(tab => (
          <button key={tab.id} onClick={() => onTabChange(tab.id)}
            className="px-5 py-1.5 text-xs font-semibold rounded-md transition-smooth cursor-pointer"
            style={activeTab === tab.id ? {
              background: 'linear-gradient(135deg, var(--accent-glow), var(--secondary-glow))',
              color: 'var(--accent-light)',
              border: '1.5px solid var(--accent-light)',
              boxShadow: '0 0 12px var(--accent-glow)',
              textShadow: '0 0 8px rgba(6, 182, 212, 0.3)'
            } : {
              color: 'var(--text-secondary)',
              border: '1px solid transparent'
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right — Status + Auth buttons */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-smooth"
          style={{
            background: 'rgba(6, 182, 212, 0.05)',
            border: '1px solid var(--border-light)'
          }}>
          {s.dot ? (
            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: s.color, boxShadow: `0 0 12px ${s.color}` }} />
          ) : (
            <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: s.color, borderTopColor: 'transparent' }} />
          )}
          <span className="text-xs font-medium" style={{ color: s.color }}>{s.label}</span>
        </div>

        {/* Auth buttons */}
        {!isLoggedIn ? (
          <button
            onClick={handleLogin}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg transition-smooth cursor-pointer hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, var(--accent-glow), var(--secondary-glow))',
              color: 'var(--accent-light)',
              border: '1.5px solid var(--accent-light)',
              boxShadow: '0 0 12px var(--accent-glow)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow-bright)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 0 12px var(--accent-glow)'
            }}
          >
            🔐 Login
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setUserMenu(!userMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-smooth cursor-pointer hover-glow"
              style={{
                background: 'var(--accent-glow)',
                border: '1px solid var(--accent)',
                boxShadow: '0 0 12px var(--accent-glow)'
              }}
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--secondary)', color: 'white' }}>
                U
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>User</span>
            </button>

            {/* Dropdown menu */}
            {userMenu && (
              <div className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-lg animate-fadeIn"
                style={{
                  background: 'var(--bg-panel)',
                  border: '1px solid var(--border)',
                  zIndex: 50
                }}
              >
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-xs font-medium rounded-lg transition-smooth hover:text-red-400"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                    e.currentTarget.style.color = 'var(--error-light)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--text-secondary)'
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}