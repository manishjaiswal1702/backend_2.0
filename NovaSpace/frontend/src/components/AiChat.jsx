import { useState, useRef, useEffect, useCallback } from 'react'

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-2 h-2 rounded-full"
          style={{
            background: 'var(--accent-light)',
            animation: 'typing-dot 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
            boxShadow: '0 0 6px var(--accent-glow)'
          }} />
      ))}
    </div>
  )
}

function ActivityLog({ lines }) {
  if (!lines.length) return null
  return (
    <div className="mt-3 rounded-lg overflow-hidden transition-smooth" style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid var(--border)' }}>
      {lines.map((line, i) => (
        <div key={i} className="flex items-start gap-3 px-3 py-2 transition-smooth"
          style={{ borderBottom: i < lines.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
          <span className="text-sm shrink-0 mt-px" style={{ color: 'var(--accent-light)' }}>
            {line.type === 'reading' ? '📖' : line.type === 'updating' ? '✨' : line.type === 'success' ? '✅' : '💬'}
          </span>
          <span className="text-xs font-mono break-all transition-smooth" style={{ color: 'var(--text-secondary)' }}>
            {line.text}
          </span>
        </div>
      ))}
    </div>
  )
}

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn gap-2`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-sm flex-1 max-w-min"
          style={{
            background: 'linear-gradient(135deg, var(--accent-glow), var(--secondary-glow))',
            border: '1px solid var(--accent)',
            boxShadow: '0 0 12px var(--accent-glow)',
            marginTop: '2px'
          }}>
          ✦
        </div>
      )}
      <div className="max-w-[80%]">
        <div className="px-4 py-3 rounded-lg text-sm leading-relaxed transition-smooth hover-glow"
          style={isUser ? {
            background: 'linear-gradient(135deg, var(--accent-glow), var(--secondary-glow))',
            border: '1px solid var(--accent-light)',
            color: 'var(--text-primary)',
            boxShadow: '0 0 12px var(--accent-glow)',
            borderBottomRightRadius: '6px'
          } : {
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-light)',
            color: 'var(--text-secondary)',
            borderBottomLeftRadius: '6px'
          }}>
          {msg.content}
        </div>
        {msg.activity && msg.activity.length > 0 && (
          <ActivityLog lines={msg.activity} />
        )}
        <div className="text-xs mt-2 px-1 transition-smooth" style={{ color: 'var(--text-muted)' }}>
          {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

function parseActivityLine(line) {
  if (!line.trim()) return null
  if (line.startsWith('Reading files')) return { type: 'reading', text: line }
  if (line.startsWith('Updating files')) return { type: 'updating', text: line }
  if (line.toLowerCase().includes('success')) return { type: 'success', text: line }
  return { type: 'info', text: line }
}

export default function AiChat({ sandboxId, onFilesChanged }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I can modify your sandbox project. Describe what you want to build or change, and I\'ll update the code for you.',
      activity: [],
      time: Date.now()
    }
  ])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef(null)
  const esRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || streaming || !sandboxId) return

    setInput('')
    setStreaming(true)

    const userMsg = { role: 'user', content: text, activity: [], time: Date.now() }
    setMessages(prev => [...prev, userMsg])

    // Add placeholder AI message
    const aiMsgId = Date.now() + 1
    setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '', activity: [], time: Date.now(), pending: true }])

    let aiContent = ''
    let activityLines = []

    try {
      // Use fetch with SSE manually
      const response = await fetch('/api/ai/invoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: text, projectId: sandboxId })
      })

      if (!response.ok) throw new Error(`Server error: ${response.status}`)

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      const updateMsg = () => {
        setMessages(prev => prev.map(m =>
          m.id === aiMsgId
            ? { ...m, content: aiContent || '…', activity: [...activityLines], pending: !aiContent }
            : m
        ))
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.trim()) continue
          const parsed = parseActivityLine(line)
          if (parsed) {
            activityLines = [...activityLines, parsed]
            // If looks like final AI text response
            if (parsed.type === 'info' && line.length > 30) {
              aiContent = line
            }
          }
          updateMsg()
        }
      }

      // If no textual content came through, construct a summary
      if (!aiContent) {
        const updates = activityLines.filter(l => l.type === 'success')
        aiContent = updates.length
          ? 'Done! Files have been updated successfully.'
          : 'Changes applied to your project.'
      }

      setMessages(prev => prev.map(m =>
        m.id === aiMsgId
          ? { ...m, content: aiContent, activity: activityLines, pending: false }
          : m
      ))

      // Trigger file explorer refresh
      onFilesChanged?.()
    } catch (err) {
      setMessages(prev => prev.map(m =>
        m.id === aiMsgId
          ? { ...m, content: `Error: ${err.message}`, activity: activityLines, pending: false }
          : m
      ))
    } finally {
      setStreaming(false)
    }
  }, [input, streaming, sandboxId, onFilesChanged])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full transition-smooth"
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden'
      }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 shrink-0 transition-smooth"
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(135deg, rgba(26,26,46,0.8) 0%, rgba(21,21,40,0.6) 100%)',
          backdropFilter: 'blur(10px)'
        }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-smooth"
          style={{
            background: 'linear-gradient(135deg, var(--accent-glow), var(--secondary-glow))',
            border: '1.5px solid var(--accent-light)',
            boxShadow: '0 0 16px var(--accent-glow)',
            color: 'var(--accent-light)'
          }}>
          ✦
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>AI Assistant</h2>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Powered by Gemini</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-smooth"
          style={{
            background: 'var(--success)',
            opacity: 0.9
          }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'white' }} />
          <span className="text-xs font-medium" style={{ color: 'white' }}>Active</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 transition-smooth">
        {messages.map((msg, i) => (
          <div key={msg.id || i} className="animate-fadeIn">
            {msg.pending && !msg.content ? (
              <div className="flex justify-start gap-2">
                <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-sm flex-1 max-w-min"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-glow), var(--secondary-glow))',
                    border: '1px solid var(--accent)',
                    boxShadow: '0 0 12px var(--accent-glow)',
                    marginTop: '2px'
                  }}>
                  ✦
                </div>
                <div className="rounded-lg overflow-hidden transition-smooth" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-light)' }}>
                  <TypingIndicator />
                  {msg.activity && msg.activity.length > 0 && <ActivityLog lines={msg.activity} />}
                </div>
              </div>
            ) : (
              <Message msg={msg} />
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="shrink-0 px-4 pb-4 pt-3 transition-smooth"
        style={{
          borderTop: '1px solid var(--border)',
          background: 'linear-gradient(135deg, rgba(26,26,46,0.6) 0%, var(--bg-panel) 100%)',
          backdropFilter: 'blur(10px)'
        }}>
        <div className="flex items-end gap-2 rounded-lg p-3 transition-smooth hover-glow"
          style={{
            background: 'var(--bg-base)',
            border: '1.5px solid var(--border)',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)'
          }}
          onFocusCapture={e => {
            e.currentTarget.style.borderColor = 'var(--accent-light)'
            e.currentTarget.style.boxShadow = '0 0 16px var(--accent-glow), inset 0 1px 2px rgba(0,0,0,0.2)'
          }}
          onBlurCapture={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.2)'
          }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={sandboxId ? 'Describe what you want to build…' : 'Create a sandbox first…'}
            disabled={!sandboxId || streaming}
            rows={1}
            className="flex-1 resize-none text-sm outline-none bg-transparent transition-smooth"
            style={{
              color: 'var(--text-primary)',
              caretColor: 'var(--accent-light)',
              maxHeight: '120px',
              lineHeight: '1.5',
              fontFamily: 'inherit',
              opacity: !sandboxId || streaming ? 0.5 : 1
            }}
            onInput={e => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || !sandboxId || streaming}
            className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-smooth cursor-pointer hover-glow"
            style={{
              background: input.trim() && sandboxId && !streaming
                ? 'linear-gradient(135deg, var(--accent), var(--accent-dim))'
                : 'rgba(6, 182, 212, 0.1)',
              color: input.trim() && sandboxId && !streaming ? '#fff' : 'var(--text-muted)',
              boxShadow: input.trim() && sandboxId && !streaming ? '0 0 16px var(--accent-glow)' : 'none',
              border: '1px solid ' + (input.trim() && sandboxId && !streaming ? 'var(--accent-light)' : 'transparent'),
              opacity: !sandboxId || streaming ? 0.5 : 1
            }}>
            {streaming ? (
              <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'currentColor', borderTopColor: 'transparent' }} />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs mt-2 text-center transition-smooth" style={{ color: 'var(--text-muted)' }}>
          ↵ Send · Shift + ↵ New line
        </p>
      </div>
    </div>
  )
}