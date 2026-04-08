export function StepIndicator({ steps, activeIndex }) {
  return (
    <ol className="mb-5 mt-2 flex list-none justify-between gap-2 p-0" aria-label="Booking progress">
      {steps.map((label, i) => {
        const done = i <= activeIndex
        const active = i === activeIndex
        return (
          <li key={label} className="flex-1 text-center text-[0.7rem]">
            <span
              className={`mx-auto mb-1.5 block h-2.5 w-2.5 rounded-full ${done || active ? 'bg-app-primary' : 'bg-app-elevated'}`}
              aria-hidden
            />
            <span className={active ? 'font-semibold text-app-fg' : 'text-app-muted'}>{label}</span>
          </li>
        )
      })}
    </ol>
  )
}
