import { useApp } from '../../hooks/useApp.js'

const ROWS = ['A', 'B', 'C', 'D']
const COLS = [1, 2, 3, 4, 5]

const taken = new Set(['3B', '4C'])

const gridCols = 'grid grid-cols-[28px_repeat(5,minmax(0,1fr))] gap-1.5'

export function SeatGrid() {
  const { selectedSeats, setSelectedSeats } = useApp()

  function toggle(seatId) {
    if (taken.has(seatId)) return
    setSelectedSeats((prev) => (prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]))
  }

  return (
    <div className="rounded-xl border border-app-elevated bg-app-surface p-4" role="group" aria-label="Seat selection">
      <div className="mb-3 rounded-lg bg-app-elevated py-1.5 text-center text-xs text-app-muted">Front</div>
      <div className={`${gridCols} mb-1.5 text-center text-[0.65rem] text-app-muted`}>
        <span className="invisible">.</span>
        {COLS.map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>
      {ROWS.map((row) => (
        <div key={row} className={`${gridCols} mb-1.5 items-center`}>
          <span className="text-center text-[0.7rem] text-app-muted">{row}</span>
          {COLS.map((col) => {
            const id = `${col}${row}`
            const isTaken = taken.has(id)
            const isSelected = selectedSeats.includes(id)
            return (
              <button
                key={id}
                type="button"
                className={`rounded-md border px-0.5 py-1 text-[0.65rem] transition-colors ${
                  isTaken
                    ? 'cursor-not-allowed border-app-elevated bg-app-bg text-app-fg line-through opacity-35'
                    : isSelected
                      ? 'border-app-primary bg-app-primary/20 text-app-fg'
                      : 'cursor-pointer border-app-elevated bg-app-bg text-app-fg hover:border-app-primary'
                }`}
                disabled={isTaken}
                onClick={() => toggle(id)}
                aria-pressed={isSelected}
                aria-label={`Seat ${id}${isTaken ? ', taken' : ''}`}
              >
                {id}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
