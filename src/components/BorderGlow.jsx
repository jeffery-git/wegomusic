import { useCallback, useEffect, useRef } from 'react'
import './BorderGlow.css'

const parseHsl = (value) => {
  const match = value.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/)
  return match ? { h: match[1], s: match[2], l: match[3] } : { h: 225, s: 86, l: 78 }
}

const gradientVars = (colors) => ({
  '--gradient-one': `radial-gradient(at 80% 55%, ${colors[0]} 0, transparent 50%)`,
  '--gradient-two': `radial-gradient(at 69% 34%, ${colors[1]} 0, transparent 50%)`,
  '--gradient-three': `radial-gradient(at 8% 6%, ${colors[2]} 0, transparent 50%)`,
  '--gradient-four': `radial-gradient(at 41% 38%, ${colors[0]} 0, transparent 50%)`,
  '--gradient-five': `radial-gradient(at 86% 85%, ${colors[1]} 0, transparent 50%)`,
  '--gradient-six': `radial-gradient(at 82% 18%, ${colors[2]} 0, transparent 50%)`,
  '--gradient-seven': `radial-gradient(at 51% 4%, ${colors[1]} 0, transparent 50%)`,
  '--gradient-base': `linear-gradient(${colors[0]} 0 100%)`,
})

export default function BorderGlow({ children, className = '', edgeSensitivity = 30, glowColor = '225 86 78', backgroundColor = '#12162a', borderRadius = 0, glowRadius = 28, glowIntensity = 1, coneSpread = 25, animated = false, colors = ['#7e92ff', '#a46cff', '#78c7ff'], fillOpacity = 0.3 }) {
  const cardRef = useRef(null)
  const updatePosition = useCallback((event) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const dx = x - rect.width / 2
    const dy = y - rect.height / 2
    const edge = Math.min(Math.max(Math.max(Math.abs(dx) / (rect.width / 2 || 1), Math.abs(dy) / (rect.height / 2 || 1)), 0), 1)
    const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 450) % 360
    card.style.setProperty('--edge-proximity', (edge * 100).toFixed(2))
    card.style.setProperty('--cursor-angle', `${angle.toFixed(2)}deg`)
  }, [])

  useEffect(() => {
    if (!animated || !cardRef.current) return
    const card = cardRef.current
    card.classList.add('sweep-active')
    card.style.setProperty('--edge-proximity', '100')
    let angle = 110
    const timer = window.setInterval(() => { angle = (angle + 4) % 360; card.style.setProperty('--cursor-angle', `${angle}deg`) }, 16)
    const end = window.setTimeout(() => { window.clearInterval(timer); card.classList.remove('sweep-active'); card.style.setProperty('--edge-proximity', '0') }, 1300)
    return () => { window.clearInterval(timer); window.clearTimeout(end) }
  }, [animated])

  const { h, s, l } = parseHsl(glowColor)
  return <div ref={cardRef} onPointerMove={updatePosition} className={`border-glow-card ${className}`.trim()} style={{ '--card-bg': backgroundColor, '--border-radius': `${borderRadius}px`, '--glow-padding': `${glowRadius}px`, '--edge-sensitivity': edgeSensitivity, '--cone-spread': coneSpread, '--fill-opacity': fillOpacity, '--glow-color': `hsl(${h}deg ${s}% ${l}% / ${Math.min(glowIntensity, 1)} )`, ...gradientVars(colors) }}><span className="edge-light" /><div className="border-glow-inner">{children}</div></div>
}
