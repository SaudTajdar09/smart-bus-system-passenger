const METHODS = [
  { id: 'upi', icon: '📱', label: 'UPI', sub: 'PhonePe, GPay, Paytm' },
  { id: 'card', icon: '💳', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
  { id: 'wallet', icon: '👜', label: 'Wallet', sub: 'Paytm, Amazon Pay' },
  { id: 'pass', icon: '🎫', label: 'Student Pass', sub: 'Auto-deduct from balance' },
]

export function PaymentMethodList({ selectedId, onSelect }) {
  return (
    <div className="my-3 space-y-2">
      {METHODS.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onSelect(m.id)}
          className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
            selectedId === m.id
              ? 'border-cb-brand bg-cb-brand-soft shadow-sm ring-1 ring-cb-brand/15'
              : 'border-slate-200/80 bg-white/80 hover:border-cb-brand/35 hover:bg-white hover:shadow-sm'
          }`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl">{m.icon}</span>
          <div>
            <div className="text-sm font-semibold text-cb-text">{m.label}</div>
            <div className="text-xs text-cb-text-secondary">{m.sub}</div>
          </div>
        </button>
      ))}
    </div>
  )
}
