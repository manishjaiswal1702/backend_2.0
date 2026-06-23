import { useState, useEffect, useCallback } from 'react'

const FILE_ICONS = {
  jsx: '⚛', tsx: '⚛', js: '🟡', ts: '🔷',
  css: '🎨', html: '🌐', json: '{}', md: '📝',
  png: '🖼', svg: '🔶', jpg: '🖼', jpeg: '🖼',
  env: '🔒', gitignore: '🙈', dockerfile: '🐳',
  default: '📄'
}

function getIcon(filename) {
  const parts = filename.split('.')
  if (parts.length === 1) return FILE_ICONS.default
  const ext = parts[parts.length - 1].toLowerCase()
  return FILE_ICONS[ext] || FILE_ICONS.default
}

function buildTree(files) {
  const root = {}
  files.forEach(path => {
    const parts = path.split('/')
    let node = root
    parts.forEach((part, i) => {
      if (!node[part]) node[part] = i === parts.length - 1 ? null : {}
      if (i < parts.length - 1) node = node[part]
    })
  })
  return root
}

function TreeNode({ name, node, depth, agentBase, activeFile, onFileSelect, path }) {
  const [open, setOpen] = useState(depth < 2)
  const isDir = node !== null && typeof node === 'object'
  const fullPath = path ? `${path}/${name}` : name
  const isActive = activeFile === fullPath

  if (isDir) {
    return (
      <div>
        <button onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 w-full text-left px-3 py-1.5 rounded transition-smooth cursor-pointer group"
          style={{
            paddingLeft: `${12 + depth * 16}px`,
            color: 'var(--text-secondary)',
            fontSize: '13px',
            background: 'transparent'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(6, 182, 212, 0.08)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}>
          <span className="text-xs transition-transform duration-200 inline-block" style={{ transform: open ? 'rotate(90deg)' : 'none', width: '16px', textAlign: 'center' }}>▶</span>
          <span className="text-lg">{open ? '📂' : '📁'}</span>
          <span className="truncate font-medium">{name}</span>
        </button>
        {open && (
          <div className="animate-fadeIn">
            {Object.entries(node).sort(([, a], [, b]) => {
              const aDir = a !== null && typeof a === 'object'
              const bDir = b !== null && typeof b === 'object'
              return bDir - aDir
            }).map(([childName, childNode]) => (
              <TreeNode key={childName} name={childName} node={childNode}
                depth={depth + 1} agentBase={agentBase} activeFile={activeFile}
                onFileSelect={onFileSelect} path={fullPath} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <button onClick={() => onFileSelect(fullPath)}
      className="flex items-center gap-2 w-full text-left px-3 py-1.5 rounded transition-smooth cursor-pointer group"
      style={{
        paddingLeft: `${12 + depth * 16}px`,
        fontSize: '13px',
        color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
        background: isActive ? 'var(--accent-glow)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--accent-light)' : '3px solid transparent',
        paddingLeft: `${9 + depth * 16}px`
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(6, 182, 212, 0.08)'
          e.currentTarget.style.color = 'var(--text-primary)'
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'var(--text-secondary)'
        }
      }}>
      <span className="text-lg">{getIcon(name)}</span>
      <span className="truncate font-medium text-xs">{name}</span>
    </button>
  )
}

export default function FileExplorer({ agentBase, activeFile, onFileSelect, refreshKey }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tree, setTree] = useState({})

  const fetchFiles = useCallback(async (isSilent = false) => {
    if (!agentBase) return false
    if (!isSilent) {
      setLoading(true)
      setError(null)
    }
    try {
      const res = await fetch(`${agentBase}/list-files`)
      if (!res.ok) throw new Error('Not ready')
      const data = await res.json()
      setFiles(data.files || [])
      setTree(buildTree(data.files || []))
      setError(null)
      setLoading(false)
      return true
    } catch (err) {
      if (!isSilent) {
        setError('Starting file synchronization...')
      }
      return false
    }
  }, [agentBase])

  useEffect(() => {
    let active = true
    let timeoutId

    const poll = async () => {
      const isSilent = files.length > 0
      const success = await fetchFiles(isSilent)
      if (active && !success) {
        timeoutId = setTimeout(poll, 1500)
      }
    }

    poll()

    return () => {
      active = false
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [fetchFiles, refreshKey, files.length])

  return (
    <aside className="flex flex-col h-full transition-smooth"
      style={{ width: '240px', minWidth: '240px', background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0 transition-smooth"
        style={{ borderBottom: '1px solid var(--border)' }}>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>
          📂 Explorer
        </span>
        <button onClick={fetchFiles} className="p-1.5 rounded-lg transition-smooth cursor-pointer group"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--accent-light)'
            e.currentTarget.style.background = 'var(--accent-glow)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--text-tertiary)'
            e.currentTarget.style.background = 'transparent'
          }}
          title="Refresh">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto py-2">
        {loading ? (
          <div className="flex items-center justify-center h-20">
            <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--accent-light)', borderTopColor: 'transparent' }} />
          </div>
        ) : error ? (
          <div className="px-4 py-3 text-xs rounded-lg" style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)' }}>
            {error}
          </div>
        ) : (
          Object.entries(tree).sort(([, a], [, b]) => {
            const aDir = a !== null && typeof a === 'object'
            const bDir = b !== null && typeof b === 'object'
            return bDir - aDir
          }).map(([name, node]) => (
            <TreeNode key={name} name={name} node={node}
              depth={0} agentBase={agentBase} activeFile={activeFile}
              onFileSelect={onFileSelect} path="" />
          ))
        )}
      </div>

      {/* Footer — file count */}
      {!loading && files.length > 0 && (
        <div className="px-3 py-1.5 shrink-0" style={{ borderTop: '1px solid #1e2d45' }}>
          <span className="text-xs" style={{ color: '#334155' }}>{files.length} files</span>
        </div>
      )}
    </aside>
  )
}