import { useRef } from 'react'

export default function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  alt,
}: {
  beforeUrl: string
  afterUrl: string
  alt: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const afterRef = useRef<HTMLDivElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  function setPct(clientX: number) {
    const el = ref.current
    const after = afterRef.current
    const divider = dividerRef.current
    const handle = handleRef.current
    if (!el || !after || !divider || !handle) return
    const rect = el.getBoundingClientRect()
    let pct = ((clientX - rect.left) / rect.width) * 100
    pct = Math.max(2, Math.min(98, pct))
    after.style.clipPath = `inset(0 0 0 ${pct}%)`
    divider.style.left = `${pct}%`
    handle.style.left = `${pct}%`
  }

  return (
    <div
      ref={ref}
      className="ba-slider"
      onPointerDown={(e) => {
        dragging.current = true
        ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
        setPct(e.clientX)
      }}
      onPointerMove={(e) => {
        if (dragging.current) setPct(e.clientX)
      }}
      onPointerUp={() => (dragging.current = false)}
      onPointerLeave={() => (dragging.current = false)}
    >
      <div className="ba-layer" style={{ backgroundImage: `url(${beforeUrl})` }} />
      <div ref={afterRef} className="ba-layer ba-after" style={{ backgroundImage: `url(${afterUrl})` }} />
      <span className="absolute top-3 left-3 text-[11px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full bg-black/45 text-white">
        Before
      </span>
      <span className="absolute top-3 right-3 text-[11px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full bg-black/45 text-white">
        After
      </span>
      <div ref={dividerRef} className="ba-divider" />
      <div ref={handleRef} className="ba-handle">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#4C1329" strokeWidth="2">
          <path d="M8 6L2 12L8 18M16 6L22 12L16 18" />
        </svg>
      </div>
      <span className="sr-only">{alt}</span>
    </div>
  )
}
