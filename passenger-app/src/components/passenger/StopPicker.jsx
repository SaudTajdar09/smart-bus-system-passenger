export function StopPicker({ stops, boardIndex, alightIndex, onChangeBoard, onChangeAlight }) {
  if (!stops?.length) return null

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-cb-text-secondary">Board at</p>
        <div className="mt-2 flex flex-col gap-1.5">
          {stops.map((name, i) => {
            const active = i === boardIndex
            return (
              <button
                key={`b-${i}`}
                type="button"
                onClick={() => onChangeBoard(i)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-all ${
                  active
                    ? 'border-cb-brand bg-cb-brand-soft text-cb-brand-text shadow-sm ring-1 ring-cb-brand/20'
                    : 'border-slate-200/80 bg-white/60 text-cb-text hover:border-cb-brand/40 hover:bg-white'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    active ? 'bg-cb-brand text-white' : 'bg-slate-100 text-cb-text-secondary'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="font-medium">{name}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 text-cb-text-tertiary">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        <span className="text-[10px] font-medium uppercase tracking-widest">to</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-cb-text-secondary">Get off at</p>
        <div className="mt-2 flex flex-col gap-1.5">
          {stops.map((name, i) => {
            const disabled = i <= boardIndex
            const active = i === alightIndex
            return (
              <button
                key={`a-${i}`}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && onChangeAlight(i)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-all ${
                  disabled
                    ? 'cursor-not-allowed border-transparent bg-slate-50/80 text-cb-text-tertiary opacity-60'
                    : active
                      ? 'border-cb-brand bg-cb-brand-soft text-cb-brand-text shadow-sm ring-1 ring-cb-brand/20'
                      : 'border-slate-200/80 bg-white/60 text-cb-text hover:border-cb-brand/40 hover:bg-white'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    disabled ? 'bg-slate-100 text-slate-400' : active ? 'bg-cb-brand text-white' : 'bg-slate-100 text-cb-text-secondary'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="font-medium">{name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
