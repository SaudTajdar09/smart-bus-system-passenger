/**
 * Placeholder QR: swap for qrcode.react or similar when you need a real bitmap.
 */
export function QRCode({ value }) {
  return (
    <div className="w-24 shrink-0 text-center" role="img" aria-label={`QR code for ${value}`}>
      <div
        className="h-24 w-24 rounded-lg border-2 border-app-elevated"
        style={{
          background: 'repeating-conic-gradient(#243044 0% 25%, #0f1419 0% 50%) 50% / 12px 12px',
        }}
      />
      <span className="mt-1.5 block break-all text-[0.6rem] text-app-muted">{value}</span>
    </div>
  )
}
