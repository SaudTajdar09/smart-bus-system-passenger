import { useMemo, useState } from 'react'
import { SectionTitle } from '../components/common/SectionTitle.jsx'
import { DemoNote } from '../components/common/DemoNote.jsx'
import { ProfileUpdateModal } from '../components/common/ProfileUpdateModal.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useLocalState } from '../hooks/useLocalState.js'
import { USER, PASSES, PASS_TYPES } from '../data/cityBusData.js'
import { formatInr } from '../utils/helpers.js'
import { formatDateTime } from '../utils/ticketTime.js'

const card = 'mb-4 rounded-2xl border border-white/60 bg-white/90 p-5 shadow-lg shadow-slate-900/[0.05] backdrop-blur-sm'
const QUICK_AMOUNTS = [100, 250, 500, 1000]

export function Account() {
  const { user } = useAuth()
  const [walletBalance, setWalletBalance] = useLocalState('citybus-wallet-balance', 250)
  const [rechargeHistory, setRechargeHistory] = useLocalState('citybus-wallet-recharges', [])
  const [amount, setAmount] = useState('250')
  const [message, setMessage] = useState('')
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  const profile = useMemo(
    () => ({
      name: user?.name ?? USER.name,
      email: user?.email || 'passenger@demo.com',
      phone: user?.phone || '+91 90000 12345',
      role: 'Passenger',
      college: USER.college,
    }),
    [user],
  )

  function recharge(nextAmount) {
    const value = Number(nextAmount)
    if (!Number.isFinite(value) || value <= 0) {
      setMessage('Enter a valid recharge amount.')
      return
    }

    const rounded = Math.round(value)
    setWalletBalance((prev) => prev + rounded)
    setRechargeHistory((prev) => [
      { id: `rch-${Date.now()}`, amount: rounded, at: new Date().toISOString() },
      ...prev,
    ])
    setMessage(`Wallet recharged with ${formatInr(rounded)}.`)
    setAmount('')
  }

  return (
    <>
      <SectionTitle>Account</SectionTitle>
      <DemoNote>Manage profile, pass options, and wallet recharge.</DemoNote>

      <div className={card}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-cb-text">Profile details</span>
          <button
            onClick={() => setShowUpdateModal(true)}
            className="rounded-lg bg-cb-brand px-3 py-1 text-xs font-semibold text-white hover:bg-cb-brand-hover transition"
          >
            ✏️ Edit
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <p><span className="font-semibold text-cb-text">Name:</span> {profile.name}</p>
          <p><span className="font-semibold text-cb-text">Role:</span> {profile.role}</p>
          <p><span className="font-semibold text-cb-text">Email:</span> {profile.email}</p>
          <p><span className="font-semibold text-cb-text">Phone:</span> {profile.phone}</p>
          <p><span className="font-semibold text-cb-text">College:</span> {profile.college}</p>
        </div>
      </div>

      <div className={card}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-cb-text">Wallet</span>
          <span className="rounded-full bg-cb-brand-soft px-3 py-1 text-xs font-semibold text-cb-brand-text">
            Balance: {formatInr(walletBalance)}
          </span>
        </div>

        <div className="mb-3">
          <label htmlFor="recharge-amount" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cb-text-secondary">
            Recharge amount
          </label>
          <div className="flex gap-2">
            <input
              id="recharge-amount"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-cb-text"
            />
            <button
              type="button"
              onClick={() => recharge(amount)}
              className="rounded-xl bg-cb-brand px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cb-brand/20 hover:bg-cb-brand-hover"
            >
              Recharge
            </button>
          </div>
        </div>

        <div className="mb-2 flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => recharge(v)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-cb-text hover:bg-slate-50"
            >
              + {formatInr(v)}
            </button>
          ))}
        </div>

        {message ? <p className="mt-2 text-xs font-medium text-emerald-700">{message}</p> : null}

        {rechargeHistory.length > 0 ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-cb-text-secondary">Recent recharges</p>
            <div className="space-y-1.5 text-sm text-cb-text-secondary">
              {rechargeHistory.slice(0, 5).map((r) => (
                <div key={r.id} className="flex items-center justify-between">
                  <span>{formatDateTime(r.at)}</span>
                  <span className="font-semibold text-cb-text">{formatInr(r.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className={card}>
        <div className="mb-3 text-sm font-semibold text-cb-text">Your current pass</div>
        {PASSES.slice(0, 1).map((p) => (
          <div
            key={p.id}
            className="rounded-2xl p-5 text-white shadow-inner"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
          >
            <div className="text-[15px] font-medium">{p.name}</div>
            <div className="text-[11px] opacity-80">{p.type} - {p.college}</div>
            <div className="mt-3 flex justify-between text-[11px] opacity-60">
              <span>Valid till {p.valid}</span>
              <span>{p.id}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={card}>
        <div className="mb-3 text-sm font-semibold text-cb-text">Pass types</div>
        <div className="space-y-3">
          {PASS_TYPES.map((p) => (
            <div key={p.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-cb-text">{p.name}</span>
                <span className="text-sm font-semibold text-cb-brand">{formatInr(p.price)}</span>
              </div>
              <p className="text-xs text-cb-text-secondary">Validity: {p.validity}</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-cb-text-secondary">
                {p.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Update Modal */}
      {showUpdateModal && (
        <ProfileUpdateModal onClose={() => setShowUpdateModal(false)} />
      )}
    </>
  )
}
