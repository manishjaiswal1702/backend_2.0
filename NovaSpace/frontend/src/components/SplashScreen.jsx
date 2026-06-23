import { useState, useEffect } from 'react'

export default function SplashScreen({ onSandboxCreated }) {
  const [loading, setLoading] = useState(false)
  const [loadingProjectId, setLoadingProjectId] = useState(null) // id being opened
  const [error, setError] = useState(null)
  const [dots, setDots] = useState('')
  const [title, setTitle] = useState('')
  const [loadingStep, setLoadingStep] = useState('') // 'project' | 'sandbox'
  const [isLoggedIn, setIsLoggedIn] = useState(null) // null = checking, boolean = logged in status

  // Existing projects
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)

  const handleLogin = () => {
    window.location.href = '/api/auth/google'
  }

  // Fetch existing projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/sandbox/project', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setProjects(data.projects || [])
          setIsLoggedIn(true)
        } else if (res.status === 401) {
          setIsLoggedIn(false)
        } else {
          setIsLoggedIn(false)
        }
      } catch {
        setIsLoggedIn(false)
      } finally {
        setProjectsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Animated dots while loading
  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.')
    }, 400)
    return () => clearInterval(interval)
  }, [loading])

  // Start sandbox for an existing project
  const handleOpenProject = async (projectId) => {
    setLoadingProjectId(projectId)
    setError(null)
    try {
      const sandboxRes = await fetch('/api/sandbox/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ projectId })
      })
      if (!sandboxRes.ok) throw new Error(`Failed to start sandbox (${sandboxRes.status})`)
      const sandboxData = await sandboxRes.json()
      onSandboxCreated(sandboxData)
    } catch (err) {
      setError(err.message || 'Failed to start sandbox')
      setLoadingProjectId(null)
    }
  }

  // Create new project then start its sandbox
  const handleCreate = async () => {
    const projectTitle = title.trim()
    if (!projectTitle) {
      setError('Please enter a project name')
      return
    }
    setLoading(true)
    setError(null)
    try {
      // Step 1: Create the project
      setLoadingStep('project')
      const projectRes = await fetch('/api/sandbox/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: projectTitle })
      })
      if (!projectRes.ok) throw new Error(`Failed to create project (${projectRes.status})`)
      const projectData = await projectRes.json()
      const projectId = projectData.project._id

      // Step 2: Start the sandbox
      setLoadingStep('sandbox')
      const sandboxRes = await fetch('/api/sandbox/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ projectId })
      })
      if (!sandboxRes.ok) throw new Error(`Failed to start sandbox (${sandboxRes.status})`)
      const sandboxData = await sandboxRes.json()
      onSandboxCreated(sandboxData)
    } catch (err) {
      setError(err.message || 'Failed to create sandbox')
      setLoading(false)
      setLoadingStep('')
    }
  }

  const isAnyLoading = loading || loadingProjectId !== null

  return (
    <div className="relative h-full w-full overflow-hidden transition-smooth" style={{ background: 'var(--bg-base)' }}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(6,182,212,0.15) 0%, rgba(167,139,250,0.08) 30%, transparent 70%)',
          animation: 'gradient-shift 8s ease-in-out infinite',
          backgroundSize: '200% 200%'
        }}
      />

      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(45,45,77,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(45,45,77,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Floating animated elements */}
      {[...Array(6)].map((_, i) => (
        <div key={i}
          className="absolute rounded-full opacity-20 animate-float"
          style={{
            width: Math.random() * 6 + 3 + 'px',
            height: Math.random() * 6 + 3 + 'px',
            background: i % 2 === 0 ? 'var(--accent-light)' : 'var(--secondary)',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            filter: 'blur(2px)',
            boxShadow: i % 2 === 0 ? '0 0 16px var(--accent-glow)' : '0 0 12px var(--secondary-glow)',
            animationDelay: Math.random() * 2 + 's'
          }}
        />
      ))}

      {/* Scrollable container for content with hidden scrollbar */}
      <div className="absolute inset-0 overflow-y-auto no-scrollbar z-10">
        <div className="flex flex-col items-center justify-between min-h-full w-full py-12 px-6 text-center animate-fadeInUp">
          <div /> {/* Top spacer to balance layout vertically */}

          <div className="flex flex-col items-center gap-10 w-full" style={{ maxWidth: '520px' }}>
        {/* Logo Icon */}
        <div className="relative animate-float">
          <div className="w-24 h-24 rounded-2xl flex items-center justify-center transition-smooth hover:scale-110 hover-glow"
            style={{
              background: 'linear-gradient(135deg, var(--accent-glow), var(--secondary-glow))',
              border: '2px solid var(--accent-light)',
              boxShadow: '0 0 40px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.1)'
            }}>
            <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
              <rect x="4" y="4" width="14" height="14" rx="2" fill="var(--accent-light)" opacity="0.9" />
              <rect x="22" y="4" width="14" height="14" rx="2" fill="var(--accent-light)" opacity="0.4" />
              <rect x="4" y="22" width="14" height="14" rx="2" fill="var(--accent-light)" opacity="0.4" />
              <rect x="22" y="22" width="14" height="14" rx="2" fill="var(--accent-light)" opacity="0.9" />
            </svg>
          </div>
          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center animate-pulse transition-smooth"
            style={{ background: 'var(--success-light)', boxShadow: '0 0 12px var(--success-light)' }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'white' }} />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tighter transition-smooth"
            style={{
              background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 40%, var(--accent-light) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 200%'
            }}>
            Sandbox IDE
          </h1>
          <p className="text-lg font-medium transition-smooth" style={{ color: 'var(--text-secondary)' }}>
            AI-powered isolated coding environments in seconds
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2.5">
          {['✨ AI-Powered', '🚀 Live Preview', '⌨️ Terminal', '📁 Explorer'].map(f => (
            <span key={f} className="px-4 py-2 text-xs font-semibold rounded-full transition-smooth hover:scale-105 hover-glow"
              style={{
                background: 'var(--accent-glow)',
                border: '1px solid var(--accent-light)',
                color: 'var(--accent-light)',
                boxShadow: '0 0 12px var(--accent-glow)'
              }}>
              {f}
            </span>
          ))}
        </div>

        {/* Dynamic section based on auth and loading status */}
        {isLoggedIn === null ? (
          <div className="w-full flex flex-col items-center justify-center py-6 gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--accent-light)', borderTopColor: 'transparent' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Checking connection...
            </span>
          </div>
        ) : !isLoggedIn ? (
          /* Login with Google */
          <div className="flex flex-col items-center gap-6 w-full animate-fadeIn">
            <p className="text-sm font-medium transition-smooth" style={{ color: 'var(--text-secondary)' }}>
              Please sign in to access your dashboard and spin up sandbox environments.
            </p>
            <button onClick={handleLogin}
              className="group relative w-full py-4 px-6 rounded-xl text-base font-bold transition-smooth cursor-pointer overflow-hidden hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
                color: '#fff',
                boxShadow: '0 0 32px var(--accent-glow), 0 8px 24px rgba(0,0,0,0.2)'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 0 48px var(--accent-glow-bright), 0 12px 32px rgba(0,0,0,0.3)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 0 32px var(--accent-glow), 0 8px 24px rgba(0,0,0,0.2)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span className="flex items-center justify-center gap-2 relative z-10">
                🔐 Login with Google
              </span>
            </button>
          </div>
        ) : (
          /* Logged In content */
          <>
            {/* Existing projects list */}
            {!isAnyLoading && (
              <>
                {projectsLoading ? (
                  <div className="w-full flex justify-center py-3">
                    <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: 'var(--accent-light)', borderTopColor: 'transparent' }} />
                  </div>
                ) : projects.length > 0 && (
                  <div className="w-full space-y-4">
                    <p className="text-xs font-bold uppercase tracking-widest transition-smooth" style={{ color: 'var(--text-tertiary)' }}>
                      📚 Recent Projects
                    </p>
                    <div className="flex flex-col gap-3">
                      {projects.map(project => (
                        <button
                          key={project._id}
                          onClick={() => handleOpenProject(project._id)}
                          disabled={isAnyLoading}
                          className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl text-left transition-smooth cursor-pointer group hover:scale-105"
                          style={{
                            background: 'rgba(6, 182, 212, 0.05)',
                            border: '1.5px solid var(--border-light)',
                            backdropFilter: 'blur(10px)'
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = 'var(--accent-glow)'
                            e.currentTarget.style.borderColor = 'var(--accent-light)'
                            e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)'
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(6, 182, 212, 0.05)'
                            e.currentTarget.style.borderColor = 'var(--border-light)'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-smooth"
                              style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent)' }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="2.5">
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                                <rect x="14" y="14" width="7" height="7" rx="1" />
                              </svg>
                            </div>
                            <span className="text-sm font-semibold transition-smooth" style={{ color: 'var(--text-primary)' }}>
                              {project.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {loadingProjectId === project._id ? (
                              <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                                style={{ borderColor: 'var(--accent-light)', borderTopColor: 'transparent' }} />
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2.5"
                                className="group-hover:stroke-cyan-300 transition-smooth">
                                <polygon points="5 3 19 12 5 21 5 3" />
                              </svg>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 py-3">
                      <div className="flex-1 h-px" style={{ background: 'var(--border-light)' }} />
                      <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>or create new</span>
                      <div className="flex-1 h-px" style={{ background: 'var(--border-light)' }} />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* New project input + CTA */}
            {!isAnyLoading ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="w-full rounded-xl overflow-hidden transition-smooth hover-glow"
                  style={{
                    background: 'rgba(6, 182, 212, 0.05)',
                    border: '1.5px solid var(--border-light)',
                    backdropFilter: 'blur(10px)'
                  }}
                  onFocusCapture={e => {
                    e.currentTarget.style.borderColor = 'var(--accent-light)'
                    e.currentTarget.style.boxShadow = '0 0 24px var(--accent-glow), inset 0 1px 2px rgba(0,0,0,0.1)'
                  }}
                  onBlurCapture={e => {
                    e.currentTarget.style.borderColor = 'var(--border-light)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <input
                    type="text"
                    value={title}
                    onChange={e => { setTitle(e.target.value); setError(null) }}
                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                    placeholder="Enter project name…"
                    className="w-full outline-none bg-transparent px-6 py-4 text-base font-medium transition-smooth"
                    style={{ color: 'var(--text-primary)', caretColor: 'var(--accent-light)' }}
                    autoFocus={projects.length === 0}
                  />
                </div>
                <button onClick={handleCreate}
                  className="group relative w-full py-4 px-6 rounded-xl text-base font-bold transition-smooth cursor-pointer overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-dim))',
                    color: '#fff',
                    boxShadow: '0 0 32px var(--accent-glow), 0 8px 24px rgba(0,0,0,0.2)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 0 48px var(--accent-glow-bright), 0 12px 32px rgba(0,0,0,0.3)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 0 32px var(--accent-glow), 0 8px 24px rgba(0,0,0,0.2)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Create New Project
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 animate-fadeIn">
                <div className="flex items-center gap-3 px-8 py-4 rounded-xl transition-smooth"
                  style={{
                    background: 'var(--accent-glow)',
                    border: '1px solid var(--accent-light)',
                    boxShadow: '0 0 20px var(--accent-glow)'
                  }}>
                  <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: 'var(--accent-light)', borderTopColor: 'transparent' }} />
                  <span className="text-sm font-semibold transition-smooth" style={{ color: 'var(--text-primary)' }}>
                    {loadingProjectId
                      ? `Starting sandbox${dots}`
                      : loadingStep === 'project'
                        ? `Creating project${dots}`
                        : `Starting sandbox${dots}`}
                  </span>
                </div>
                <p className="text-xs font-medium transition-smooth" style={{ color: 'var(--text-tertiary)' }}>
                  {loadingProjectId
                    ? '✨ Spinning up your isolated environment…'
                    : loadingStep === 'project'
                      ? '📝 Registering your project…'
                      : '✨ Spinning up your isolated environment…'}
                </p>
              </div>
            )}
          </>
        )}

        {error && (
          <div className="px-6 py-4 rounded-xl text-sm font-medium animate-fadeIn transition-smooth"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1.5px solid var(--error)',
              color: 'var(--error)',
              boxShadow: '0 0 16px rgba(239, 68, 68, 0.2)'
            }}>
            ⚠️ {error}
          </div>
        )}
          </div>

          {/* Bottom branding */}
          <div className="mt-10 text-xs font-medium transition-smooth" style={{ color: 'var(--text-muted)' }}>
            🚀 Powered by AI • Isolated Runtime • Zero Config
          </div>
        </div>
      </div>
    </div>
  )
}