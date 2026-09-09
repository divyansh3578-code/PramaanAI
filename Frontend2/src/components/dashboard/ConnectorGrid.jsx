import { useEffect, useState } from 'react'
import Icon from '../common/Icon.jsx'
import ConnectorCard from './ConnectorCard.jsx'
import { PRIMARY_CONNECTORS } from '../../data/connectors.js'
import { api } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'

// Backend connector probe names (see verification.controller.js connectorsStatus)
// mapped to the matching card id in data/connectors.js.
const CODE_TO_ID = { GSTN: 'gstn', UDYAM: 'udyam', MCA21: 'mca21', 'EPFO-ESIC': 'epfo-esic' }

export default function ConnectorGrid({ connectors = PRIMARY_CONNECTORS, title = 'Live Government Registry Connectors (National Informatics Centre Endpoints)' }) {
  const { user } = useAuth()
  const [live, setLive] = useState(null) // { [connectorId]: { status, latencyMs } }

  useEffect(() => {
    if (!user) return
    api
      .getConnectorsStatus()
      .then((res) => {
        const map = {}
        for (const c of res.connectors || []) {
          const id = CODE_TO_ID[c.name]
          if (id) map[id] = c
        }
        setLive(map)
      })
      .catch(() => setLive(null))
  }, [user])

  // Merge live probe results into the display connectors without touching
  // ConnectorCard's rendering logic — it already reads `status` and `stats`.
  const merged = connectors.map((c) => {
    const probe = live?.[c.id]
    if (!probe) return c
    return {
      ...c,
      status: probe.status,
      stats: [{ label: 'Live Latency:', value: `${probe.latencyMs}ms`, accent: probe.status === 'Active' }, ...c.stats.slice(1)],
    }
  })

  const activeCount = merged.filter((c) => c.status === 'Active').length

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-navy">
          <Icon name="dns" size={18} />
          <h3 className="font-bold text-[14px]">{title}</h3>
        </div>
        <span className="font-mono text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          {live ? `${activeCount}/${merged.length} Connectors Live from Backend` : `All ${merged.length} Govt Gateway Endpoints Operational • Polling Rate: 2.5s`}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {merged.map((c) => (
          <ConnectorCard key={c.id} connector={c} />
        ))}
      </div>
    </div>
  )
}
