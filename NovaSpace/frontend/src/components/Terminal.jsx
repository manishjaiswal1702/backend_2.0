import { useEffect, useRef, useState, useCallback } from 'react'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { io } from 'socket.io-client'

export default function Terminal({ sandboxId }) {
  const containerRef = useRef(null)
  const termRef = useRef(null)
  const fitAddonRef = useRef(null)
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(null)

  const initTerminal = useCallback(() => {
    if (!containerRef.current || termRef.current) return

    const term = new XTerm({
      theme: {
        background: 'var(--bg-base)',
        foreground: 'var(--text-primary)',
        cursor: 'var(--accent-light)',
        cursorAccent: 'var(--bg-base)',
        selectionBackground: 'var(--accent-glow-bright)',
        black: '#2d2d4d',
        red: 'var(--error)',
        green: 'var(--success-light)',
        yellow: 'var(--warning-light)',
        blue: '#60a5fa',
        magenta: 'var(--secondary)',
        cyan: 'var(--accent-light)',
        white: 'var(--text-secondary)',
        brightBlack: '#4d4d6d',
        brightRed: 'var(--error-light)',
        brightGreen: 'var(--success-light)',
        brightYellow: 'var(--warning-light)',
        brightBlue: '#93c5fd',
        brightMagenta: 'var(--secondary-light)',
        brightCyan: 'var(--accent-light)',
        brightWhite: 'var(--text-primary)',
      },
      fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
      fontSize: 13,
      lineHeight: 1.6,
      cursorBlink: true,
      cursorStyle: 'bar',
      scrollback: 5000,
      allowProposedApi: true,
    })

    const fitAddon = new FitAddon()
    const webLinksAddon = new WebLinksAddon()
    term.loadAddon(fitAddon)
    term.loadAddon(webLinksAddon)
    term.open(containerRef.current)
    fitAddon.fit()

    termRef.current = term
    fitAddonRef.current = fitAddon

    term.writeln('\x1b[36m╔══════════════════════════════════════╗\x1b[0m')
    term.writeln('\x1b[36m║   \x1b[1mSandbox Terminal\x1b[0m\x1b[36m                  ║\x1b[0m')
    term.writeln('\x1b[36m╚══════════════════════════════════════╝\x1b[0m')
    term.writeln('')
    term.writeln('\x1b[33mConnecting to sandbox...\x1b[0m')

    return term
  }, [])

  const connectSocket = useCallback((term) => {
    if (!sandboxId || !term) return

    const agentHost = `http://${sandboxId}.agent.localhost`

    try {
      const socket = io(agentHost, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })

      socketRef.current = socket

      socket.on('connect', () => {
        setConnected(true)
        setError(null)
        term.writeln('\x1b[32m✓ Connected to sandbox shell\x1b[0m')
        term.writeln('')
      })

      socket.on('disconnect', () => {
        setConnected(false)
        term.writeln('\r\n\x1b[33m⚠ Disconnected. Reconnecting...\x1b[0m')
      })

      socket.on('connect_error', (err) => {
        setConnected(false)
        setError('Connection failed')
        term.writeln(`\r\n\x1b[31m✗ Connection error: ${err.message}\x1b[0m`)
      })

      socket.on('terminal-output', (data) => {
        term.write(data)
      })

      term.onData((data) => {
        socket.emit('terminal-input', data)
      })

    } catch (err) {
      setError(err.message)
    }
  }, [sandboxId])

  useEffect(() => {
    const term = initTerminal()
    if (term) connectSocket(term)

    return () => {
      if (socketRef.current) { socketRef.current.disconnect(); socketRef.current = null }
      if (termRef.current) { termRef.current.dispose(); termRef.current = null }
    }
  }, [initTerminal, connectSocket])

  // Handle resize
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      if (fitAddonRef.current) {
        try { fitAddonRef.current.fit() } catch (_) { }
      }
    })
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex flex-col h-full transition-smooth"
      style={{ background: 'var(--bg-base)' }}>

      {/* Terminal toolbar */}
      <div className="flex items-center justify-between px-4 shrink-0 transition-smooth"
        style={{
          height: '40px',
          background: 'linear-gradient(135deg, var(--bg-panel) 0%, rgba(26,26,46,0.6) 100%)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(10px)'
        }}>
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="2.5">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-tight" style={{ color: 'var(--text-secondary)' }}>
            Terminal
          </span>
        </div>
        <div className="flex items-center gap-3">
          {error && (
            <span className="text-xs px-2 py-1 rounded-lg font-medium transition-smooth"
              style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              {error}
            </span>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-smooth"
            style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent)' }}>
            <div className="w-2 h-2 rounded-full animate-pulse"
              style={{
                background: connected ? 'var(--success-light)' : 'var(--error)',
                boxShadow: `0 0 8px ${connected ? 'var(--success-light)' : 'var(--error)'}`
              }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
              {connected ? '✓ Connected' : '✗ Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* xterm container */}
      <div ref={containerRef} className="flex-1 overflow-hidden transition-smooth" />
    </div>
  )
}