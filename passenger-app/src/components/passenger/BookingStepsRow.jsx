const LABELS = ['Route', 'Stops', 'Seat', 'Pay', 'Done']

export function BookingStepsRow({ activeIndex }) {
  return (
    <div className="mb-6 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex min-w-[280px] justify-between gap-0.5 sm:min-w-0">
        {LABELS.map((label, i) => (
          <div key={label} className="flex mt-2 min-w-0 flex-1 flex-col items-center px-0.5 text-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                i < activeIndex
                  ? 'bg-cb-brand text-white shadow-md shadow-cb-brand/25'
                  :                 i === activeIndex
                    ? 'bg-white text-cb-brand shadow-md ring-2 ring-cb-brand ring-offset-2 ring-offset-slate-100'
                    : 'border border-slate-200 bg-white/80 text-cb-text-secondary'
              }`}
            >
              {i < activeIndex ? '✓' : i + 1}
            </div>
            <span className="mt-1.5 max-w-[4.5rem] text-[9px] font-medium uppercase leading-tight tracking-wide text-cb-text-secondary sm:max-w-none sm:text-[10px]">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
