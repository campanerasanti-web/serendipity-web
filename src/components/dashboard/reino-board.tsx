'use client'
import { useState, useEffect, useCallback } from 'react'
import { RefreshCw, Globe2, AlertTriangle, Plus, X } from 'lucide-react'

const CYAN = '#00C8D4', RED = '#E63946', GREEN = '#2ECC71', AMBER = '#F59E0B', PURPLE = '#8B5CF6'
const BASE = { bg: '#0a0f1e', card: '#0d1117', border: '#1e293b', border2: '#0f172a' }
const TEXT = { primary: '#f1f5f9', secondary: '#94a3b8', muted: '#475569' }

const fmtSF = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(2)}M` : n >= 1000 ? `${(n/1000).toFixed(1)}K` : String(Math.round(n))
const timeAgo = (ts: string) => {
  const d = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  return d < 60 ? `${d}s` : d < 3600 ? `${Math.floor(d/60)}m` : d < 86400 ? `${Math.floor(d/3600)}h` : `${Math.floor(d/86400)}d`
}
const fmtDate = (s: string | null) => {
  if (!s) return '—'
  const d = new Date(s)
  return `${d.toLocaleString('en', { month: 'short' })} ${d.getDate()}`
}
const statusColor = (s: string) => s === 'DELIVERED' ? GREEN : s === 'OVERDUE' ? RED : s === 'URGENT' ? AMBER : CYAN
const eventIcon = (t: string) => t === 'BIRTH' ? { symbol: '◎', color: PURPLE } : t === 'DELIVERY' ? { symbol: '✓', color: GREEN } : { symbol: '↻', color: CYAN }

function Pill({ color, children, sm }: { color: string; children: React.ReactNode; sm?: boolean }) {
  return (
    <span style={{
      background: `${color}18`, color, border: `1px solid ${color}35`,
      borderRadius: 4, padding: sm ? '0px 5px' : '1px 7px',
      fontSize: sm ? 10 : 11, fontWeight: 700,
      fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap',
    }}>{children}</span>
  )
}

function NodeCard({ node, selected, onClick }: { node: any; selected: boolean; onClick: () => void }) {
  const hasOverdue = node.citizens_overdue > 0
  const accent = hasOverdue ? RED : selected ? CYAN : TEXT.muted
  return (
    <div onClick={onClick} style={{
      padding: '12px 14px', borderRadius: 8, cursor: 'pointer',
      background: selected ? `${CYAN}0a` : BASE.card,
      border: `1px solid ${selected ? CYAN+'50' : hasOverdue ? RED+'30' : BASE.border}`,
      borderLeft: `3px solid ${accent}`, marginBottom: 6, transition: 'all 0.15s',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13 }}>{node.country_flag}</span>
          <span style={{ color: TEXT.primary, fontWeight: 700, fontSize: 13 }}>{node.company}</span>
        </div>
        <span style={{ color: TEXT.muted, fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>{node.db_code}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <div style={{ color: CYAN, fontSize: 15, fontWeight: 900, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
            {fmtSF(node.sf_in_census)}
          </div>
          <div style={{ color: TEXT.muted, fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em' }}>SF en censo</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' as const }}>
          {hasOverdue && <Pill color={RED} sm>{node.citizens_overdue} OVR</Pill>}
          <span style={{ color: TEXT.muted, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>
            {node.citizens_active}A · {node.citizens_delivered}D
          </span>
        </div>
      </div>
    </div>
  )
}

function CitizenRow({ c }: { c: any }) {
  const sc = statusColor(c.vital_status)
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '150px 1fr 90px 70px 60px',
      alignItems: 'center', padding: '8px 12px',
      borderBottom: `1px solid ${BASE.border2}`,
      background: c.vital_status === 'OVERDUE' ? `${RED}06` : 'transparent',
    }}>
      <span style={{ color: CYAN, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
        {c.citizen_id}
      </span>
      <span style={{ color: TEXT.secondary, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 8 }}>
        {c.purpose}
      </span>
      <Pill color={sc} sm>{c.vital_status}</Pill>
      <span style={{ color: TEXT.secondary, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', textAlign: 'right' }}>
        {c.sqft_produced > 0 ? fmtSF(c.sqft_produced) : '—'}
      </span>
      <span style={{ color: TEXT.muted, fontSize: 11, textAlign: 'right' }}>
        {fmtDate(c.actual_etd || c.promised_etd)}
      </span>
    </div>
  )
}

function EventRow({ e, i }: { e: any; i: number }) {
  const { symbol, color } = eventIcon(e.event_type)
  return (
    <div style={{ padding: '8px 12px', borderBottom: `1px solid ${BASE.border2}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
        <span style={{ color, fontSize: 12, fontWeight: 900, width: 14, flexShrink: 0 }}>{symbol}</span>
        <span style={{ color, fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{e.event_type}</span>
        <span style={{ color: CYAN, fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}>{e.citizen_id}</span>
        <span style={{ color: TEXT.muted, fontSize: 10, marginLeft: 'auto' }}>{timeAgo(e.timestamp)}</span>
      </div>
      <div style={{ color: TEXT.muted, fontSize: 11, paddingLeft: 22, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {e.father} · {e.purpose}
      </div>
    </div>
  )
}

function BirthModal({ onClose, onBirth }: { onClose: () => void; onBirth: (d: any) => Promise<string> }) {
  const [father, setFather] = useState('')
  const [race, setRace] = useState('SHEEP')
  const [qty, setQty] = useState('')
  const [purpose, setPurpose] = useState('')
  const [etd, setEtd] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!father.trim()) return
    setLoading(true)
    const id = await onBirth({ father, race, order_qty_sf: parseFloat(qty) || 0, purpose, promised_etd: etd || null })
    setResult(id)
    setLoading(false)
  }

  const inp = {
    background: '#0a0f1e', border: `1px solid ${BASE.border}`, borderRadius: 6,
    color: TEXT.primary, padding: '8px 12px', fontSize: 13, width: '100%',
    outline: 'none', fontFamily: 'inherit',
  }
  const lbl: React.CSSProperties = { color: TEXT.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4, display: 'block' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: BASE.card, border: `1px solid ${BASE.border}`, borderRadius: 12, padding: 28, width: 420, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: TEXT.muted, cursor: 'pointer' }}>
          <X size={16} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: CYAN, boxShadow: `0 0 8px ${CYAN}` }} />
          <span style={{ color: TEXT.primary, fontWeight: 800, fontSize: 15 }}>New Citizen — Birth Event</span>
        </div>
        {result ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ color: GREEN, fontSize: 13, marginBottom: 8 }}>Citizen born successfully</div>
            <div style={{ color: CYAN, fontFamily: 'JetBrains Mono, monospace', fontSize: 16, fontWeight: 900 }}>{result}</div>
            <button onClick={onClose} style={{ marginTop: 20, padding: '8px 24px', background: `${CYAN}15`, border: `1px solid ${CYAN}40`, borderRadius: 6, color: CYAN, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
              Close
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={lbl}>Father (Client)</label>
              <input style={inp} placeholder="PRARA, CAIHONG, KUMAR..." value={father} onChange={e => setFather(e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={lbl}>Race</label>
                <select style={{ ...inp }} value={race} onChange={e => setRace(e.target.value)}>
                  {['SHEEP','GOAT','COW','BULK'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Order Qty (SF)</label>
                <input style={inp} type="number" placeholder="0" value={qty} onChange={e => setQty(e.target.value)} />
              </div>
            </div>
            <div>
              <label style={lbl}>Purpose (Article)</label>
              <input style={inp} placeholder="1.5-1.7 SHEEP NAPPA BLACK..." value={purpose} onChange={e => setPurpose(e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Promised ETD</label>
              <input style={{ ...inp }} type="date" value={etd} onChange={e => setEtd(e.target.value)} />
            </div>
            <button onClick={handleSubmit} disabled={!father.trim() || loading}
              style={{ marginTop: 4, padding: '10px 0', background: `${CYAN}15`, border: `1px solid ${CYAN}50`, borderRadius: 8, color: CYAN, fontWeight: 800, fontSize: 13, cursor: father.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: CYAN, boxShadow: `0 0 6px ${CYAN}` }} />
              {loading ? 'Birthing...' : 'Birth Citizen'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function ReinoBoard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [citizens, setCitizens] = useState<any[]>([])
  const [citizensLoading, setCitizensLoading] = useState(false)
  const [showBirth, setShowBirth] = useState(false)
  const [refreshedAt, setRefreshedAt] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/local/reino')
      if (r.ok) {
        const d = await r.json()
        setData(d)
        setCitizens(d.top_citizens || [])
        setRefreshedAt(new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }))
      }
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const selectNode = async (company: string | null) => {
    setSelectedNode(company)
    if (!company) { setCitizens(data?.top_citizens || []); return }
    setCitizensLoading(true)
    try {
      const r = await fetch('/api/local/reino', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'citizens_by_father', father: company, limit: 60 }),
      })
      if (r.ok) { const d = await r.json(); setCitizens(d.citizens || []) }
    } finally { setCitizensLoading(false) }
  }

  const handleBirth = async (body: any) => {
    const r = await fetch('/api/local/reino', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'birth', ...body }) })
    const d = await r.json()
    if (d.ok) { load(); return d.citizen_id }
    return 'error'
  }

  const c = data?.census

  return (
    <div style={{ background: BASE.bg, minHeight: '100vh', padding: '24px 28px', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Globe2 size={20} color={CYAN} />
            <h1 style={{ color: TEXT.primary, fontSize: 22, fontWeight: 900, margin: 0 }}>El Reino</h1>
          </div>
          <div style={{ color: TEXT.muted, fontSize: 12 }}>
            {c ? `${c.total.toLocaleString()} citizens · ${c.active.toLocaleString()} active · ${c.delivered.toLocaleString()} delivered` : 'Loading...'}
            {c && c.overdue > 0 && <span style={{ color: RED, fontWeight: 700 }}> · {c.overdue} OVERDUE</span>}
            {refreshedAt && <span style={{ marginLeft: 8 }}>updated {refreshedAt}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={load} disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 6, border: `1px solid ${BASE.border}`, background: 'transparent', color: TEXT.secondary, fontSize: 12, cursor: 'pointer' }}>
            <RefreshCw size={13} />
            Refresh
          </button>
          <button onClick={() => setShowBirth(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 6, border: `1px solid ${CYAN}50`, background: `${CYAN}10`, color: CYAN, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            <Plus size={13} />
            New Citizen
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      {c && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'TOTAL CITIZENS', value: c.total.toLocaleString(), color: TEXT.primary },
            { label: 'ACTIVE', value: c.active.toLocaleString(), color: CYAN },
            { label: 'DELIVERED', value: c.delivered.toLocaleString(), color: GREEN },
            { label: 'OVERDUE', value: String(c.overdue), color: c.overdue > 0 ? RED : TEXT.muted },
            { label: 'SF IN CENSUS', value: fmtSF(c.sf_total), color: AMBER },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: BASE.card, border: `1px solid ${BASE.border}`, borderRadius: 8, padding: '14px 16px' }}>
              <div style={{ color, fontSize: 24, fontWeight: 900, fontFamily: 'JetBrains Mono, monospace', lineHeight: 1, marginBottom: 4 }}>{value}</div>
              <div style={{ color: TEXT.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Overdue Banner */}
      {data && data.overdue_citizens.length > 0 && (
        <div style={{ background: `${RED}08`, border: `1px solid ${RED}30`, borderLeft: `3px solid ${RED}`, borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <AlertTriangle size={14} color={RED} />
            <span style={{ color: RED, fontWeight: 800, fontSize: 13 }}>{data.overdue_citizens.length} OVERDUE</span>
            <span style={{ color: TEXT.muted, fontSize: 12 }}>— promised ETD has passed, 0 SF produced</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            {data.overdue_citizens.map((o: any) => (
              <div key={o.citizen_id} style={{ background: `${RED}10`, border: `1px solid ${RED}25`, borderRadius: 6, padding: '6px 12px' }}>
                <div style={{ color: CYAN, fontSize: 10, fontFamily: 'JetBrains Mono, monospace', marginBottom: 2 }}>{o.citizen_id}</div>
                <div style={{ color: TEXT.secondary, fontSize: 11, marginBottom: 2 }}>{o.purpose}</div>
                <div style={{ color: RED, fontSize: 10 }}>ETD {fmtDate(o.promised_etd)} · {o.father}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 280px', gap: 16 }}>

        {/* Nodes */}
        <div>
          <div style={{ color: TEXT.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            NODOS ({data?.nodes.length ?? 0})
          </div>
          <div onClick={() => selectNode(null)} style={{
            padding: '10px 14px', borderRadius: 8, cursor: 'pointer', marginBottom: 6,
            background: !selectedNode ? `${CYAN}0a` : BASE.card,
            border: `1px solid ${!selectedNode ? CYAN+'40' : BASE.border}`,
          }}>
            <span style={{ color: !selectedNode ? CYAN : TEXT.secondary, fontSize: 12, fontWeight: 700 }}>All Nodes</span>
          </div>
          {data?.nodes.map((n: any) => (
            <NodeCard key={n.node_id} node={n} selected={selectedNode === n.company}
              onClick={() => selectNode(selectedNode === n.company ? null : n.company)} />
          ))}
        </div>

        {/* Citizens */}
        <div style={{ background: BASE.card, border: `1px solid ${BASE.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BASE.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: TEXT.secondary, fontSize: 12, fontWeight: 700 }}>
              {selectedNode ? `${selectedNode} — CITIZENS` : 'TOP CITIZENS BY SF'}
            </span>
            {citizensLoading && <span style={{ color: TEXT.muted, fontSize: 11 }}>Loading...</span>}
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 380px)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 90px 70px 60px', padding: '6px 12px', borderBottom: `1px solid ${BASE.border}` }}>
              {['ID','ARTICLE','STATUS','SF PROD','ETD'].map(h => (
                <span key={h} style={{ color: TEXT.muted, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              ))}
            </div>
            {citizens.map((c: any) => <CitizenRow key={c.citizen_id} c={c} />)}
            {citizens.length === 0 && !citizensLoading && (
              <div style={{ padding: 40, textAlign: 'center', color: TEXT.muted, fontSize: 13 }}>No citizens</div>
            )}
          </div>
        </div>

        {/* DNA Feed */}
        <div style={{ background: BASE.card, border: `1px solid ${BASE.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BASE.border}` }}>
            <span style={{ color: TEXT.secondary, fontSize: 12, fontWeight: 700 }}>PULSO — DNA EVENTS</span>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 310px)' }}>
            {data?.recent_events.map((e: any, i: number) => <EventRow key={i} e={e} i={i} />)}
          </div>
        </div>

      </div>

      {showBirth && <BirthModal onClose={() => setShowBirth(false)} onBirth={handleBirth} />}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}`}</style>
    </div>
  )
}
