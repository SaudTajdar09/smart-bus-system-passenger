import { SectionTitle } from '../components/common/SectionTitle.jsx'
import { PopupNotification } from '../components/common/PopupNotification.jsx'
import { ScannerBox } from '../components/conductor/ScannerBox.jsx'
import { useConductor } from '../hooks/useConductor.js'
import { Card } from '../components/ui/Card.jsx'

export function Scanner() {
  const { passengers, popupNotification } = useConductor()

  const recentlyBoarded = passengers
    .filter((p) => p.status === 'boarded' || p.status === 'expired')
    .sort((a, b) => new Date(b.scanTime) - new Date(a.scanTime))
    .slice(0, 3)

  return (
    <>
      <SectionTitle>QR Scanner</SectionTitle>

      {/* Popup Notification */}
      {popupNotification && (
        <PopupNotification
          title={popupNotification.title}
          message={popupNotification.message}
          type={popupNotification.type}
          duration={4000}
        />
      )}

      {/* Scanner Box */}
      <ScannerBox />

      {/* Recently Boarded */}
      {recentlyBoarded.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold text-cb-text-secondary">Recently Scanned</p>
          <div className="space-y-2">
            {recentlyBoarded.map((passenger) => (
              <Card key={passenger.id} className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-cb-text">{passenger.name}</p>
                    <p className="text-xs text-cb-text-tertiary">Seat {passenger.seat}</p>
                  </div>
                  <span className="inline-flex h-6 items-center rounded-full bg-emerald-100 px-2 text-xs font-semibold text-emerald-700">
                    ✓ Boarded
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
