import { BOOKED_SEAT_IDS } from '../../data/cityBusData.js'
import { useTicketsPartitioned } from '../../hooks/useTickets.js'

const ROWS = 10
const COLS = ['A', 'B', 'C', 'D']

function seatId(row, col) {
  return `${row}${col}`
}

export function SeatMapCity({ routeId, selectedSeats, onToggle }) {
  const { active } = useTicketsPartitioned()

  const activeSeatIdsForRoute = new Set(
    active
      .filter((t) => t.route === routeId)
      .flatMap((t) => (Array.isArray(t.seats) && t.seats.length ? t.seats : t.seat ? [t.seat] : [])),
  )

  const seats = []
  for (let r = 1; r <= ROWS; r++) {
    for (const c of COLS) {
      seats.push({ id: seatId(r, c), row: r, col: c })
    }
  }

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-cb-text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded border border-cb-border-strong bg-cb-card" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded border border-cb-seat-booked-border bg-cb-seat-booked" />
          Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded bg-cb-brand" />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3.5 w-3.5 rounded border border-emerald-600/40 bg-emerald-100" />
          Yours
        </span>
      </div>
      <div className="mb-3 rounded-lg bg-white py-2 text-center text-[11px] font-medium text-cb-text-secondary shadow-sm">DRIVER</div>
      <div className="mx-auto grid max-w-[280px] grid-cols-4 gap-1.5">
        {seats.map(({ id }) => {
          const booked = BOOKED_SEAT_IDS.has(id)
          const yours = activeSeatIdsForRoute.has(id)
          const selected = selectedSeats.includes(id)
          const clickable = !booked && !yours

          let cell =
            'flex aspect-square w-full items-center justify-center rounded-lg border text-[11px] font-semibold transition-all '
          if (booked) cell += 'cursor-not-allowed border-cb-seat-booked-border bg-cb-seat-booked text-cb-red-text'
          else if (yours) cell += 'cursor-default border-emerald-600/40 bg-emerald-100 text-emerald-900'
          else if (selected) cell += 'cursor-pointer border-cb-brand bg-cb-brand text-white shadow-sm'
          else cell += 'cursor-pointer border-slate-200 bg-white hover:border-cb-brand/50 hover:bg-cb-brand-soft'

          return (
            <button
              key={id}
              type="button"
              disabled={!clickable}
              className={cell}
              onClick={() => clickable && onToggle(id)}
              aria-pressed={selected}
            >
              {id}
            </button>
          )
        })}
      </div>
    </div>
  )
}

