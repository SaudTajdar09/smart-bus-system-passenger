export function DemoNote({ children = 'Demo mode — simulated data' }) {
  return (
    <p className="mb-3 rounded-xl border border-sky-100 bg-sky-50/80 px-3 py-2 text-center text-[11px] font-medium text-sky-900/70">
      {children}
    </p>
  )
}
