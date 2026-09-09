import Breadcrumb from '../components/common/Breadcrumb.jsx'
import SectionCard from '../components/common/SectionCard.jsx'
import Icon from '../components/common/Icon.jsx'
import ConnectorGrid from '../components/dashboard/ConnectorGrid.jsx'
import { ALL_CONNECTORS, CONNECTOR_STATUS_STYLES } from '../data/connectors.js'

export default function StatutoryBridgesPage() {
  const desynced = ALL_CONNECTORS.filter((c) => c.status !== 'Active')

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Statutory Bridges (GSTN/MCA/Udyam)' }]} />

      <SectionCard
        eyebrow="Statutory Bridge Network"
        title="Government Registry Bridges"
        description="The full cross-verification universe TenderVerify AI reconciles bidder declarations against — statutory registries, internal CPCL systems, and document-authenticity bridges."
      >
        <div className="flex items-center gap-4 flex-wrap text-[11px] font-mono">
          {Object.entries(CONNECTOR_STATUS_STYLES).map(([status, s]) => (
            <span key={status} className={`flex items-center gap-1.5 px-2 py-1 rounded border ${s.bg} ${s.text}`}>
              <span className={`w-2 h-2 rounded-full ${s.dot}`} />
              {status}
            </span>
          ))}
          {desynced.length > 0 && (
            <span className="flex items-center gap-1.5 text-amber-700">
              <Icon name="warning" size={14} />
              {desynced.length} bridge{desynced.length > 1 ? 's' : ''} currently desynced — auto-retry scheduled
            </span>
          )}
        </div>
      </SectionCard>

      <ConnectorGrid connectors={ALL_CONNECTORS} title="Full Statutory & Internal Bridge Network (11 Endpoints)" />
    </>
  )
}
