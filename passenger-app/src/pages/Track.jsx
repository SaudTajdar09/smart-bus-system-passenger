import { SectionTitle } from '../components/common/SectionTitle.jsx'
import { DemoNote } from '../components/common/DemoNote.jsx'
import { TrackMapSvg } from '../components/passenger/TrackMapSvg.jsx'
import { LiveBusCard } from '../components/passenger/LiveBusCard.jsx'
import { BUSES } from '../data/cityBusData.js'

export function Track() {
  return (
    <>
      <SectionTitle>Live bus tracking</SectionTitle>
      <DemoNote>GPS simulation — buses move along routes</DemoNote>
      <div className="mb-4 overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-lg shadow-slate-900/[0.05] backdrop-blur-sm">
        <TrackMapSvg />
      </div>
      {BUSES.map((b) => (
        <LiveBusCard key={b.id} bus={b} />
      ))}
    </>
  )
}
