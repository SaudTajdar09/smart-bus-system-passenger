/** Deterministic fake QR pattern for demo (reference algorithm) */
export function generateQrSvg(data) {
  const size = 21
  const cells = []
  let seed = data.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 0)
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff
    return (seed >>> 0) / 4294967296
  }

  for (let i = 0; i < 7; i++)
    for (let j = 0; j < 7; j++) {
      const b = i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)
      cells.push({ r: i, c: j, f: b })
      cells.push({ r: i, c: size - 7 + j, f: b })
      cells.push({ r: size - 7 + i, c: j, f: b })
    }
  for (let i = 8; i < size - 8; i++)
    for (let j = 8; j < size - 8; j++) cells.push({ r: i, c: j, f: rand() > 0.45 })

  const cell = 5
  const rects = cells
    .map((c) => `<rect x="${c.c * cell}" y="${c.r * cell}" width="${cell}" height="${cell}" fill="${c.f ? '#111' : 'white'}"/>`)
    .join('')

  return `<svg width="120" height="120" viewBox="0 0 ${size * cell} ${size * cell}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="100%" height="100%" fill="white"/>${rects}</svg>`
}
