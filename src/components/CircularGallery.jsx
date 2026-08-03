import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl'
import { useEffect, useRef, useState } from 'react'
import './CircularGallery.css'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const lerp = (from, to, amount) => from + (to - from) * amount

class Card {
  constructor({ gl, geometry, scene, image, index, count, viewport }) {
    this.index = index; this.count = count; this.viewport = viewport; this.extra = 0
    this.texture = new Texture(gl, { generateMipmaps: true })
    this.program = new Program(gl, { vertex: `attribute vec3 position;attribute vec2 uv;uniform mat4 modelViewMatrix;uniform mat4 projectionMatrix;varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`, fragment: `precision highp float;uniform sampler2D tMap;uniform float uRadius;varying vec2 vUv;float box(vec2 p,vec2 b,float r){vec2 d=abs(p)-b;return length(max(d,0.))+min(max(d.x,d.y),0.)-r;}void main(){float a=1.-smoothstep(-.003,.003,box(vUv-.5,vec2(.5-uRadius),uRadius));vec4 c=texture2D(tMap,vUv);gl_FragColor=vec4(c.rgb,a);}`, uniforms: { tMap: { value: this.texture }, uRadius: { value: .035 } }, transparent: true, depthTest: false, depthWrite: false })
    this.mesh = new Mesh(gl, { geometry, program: this.program }); this.mesh.setParent(scene)
    const imageElement = new Image(); imageElement.decoding = 'async'; imageElement.src = image; imageElement.onload = () => { this.texture.image = imageElement }
    this.resize(viewport)
  }
  resize(viewport) { this.viewport = viewport; this.width = viewport.width * .205; this.height = this.width * 1.08; this.gap = viewport.width * .13; this.pitch = this.width + this.gap; this.total = this.pitch * this.count; this.mesh.scale.set(this.width, this.height, 1) }
  update(scroll, screen, controlElement) { let x = this.index * this.pitch - scroll - this.extra; const half = this.viewport.width / 2; if (x < -half - this.pitch) this.extra -= this.total; if (x > half + this.pitch) this.extra += this.total; x = this.index * this.pitch - scroll - this.extra; const ratio = clamp(x / (half * .92), -1, 1); const depth = Math.abs(ratio); const scale = 1 - depth * .16; this.mesh.position.x = x; this.mesh.position.y = -(depth * depth) * this.viewport.height * .20; this.mesh.position.z = -depth * 2.1; this.mesh.rotation.z = 0; this.mesh.scale.set(this.width * scale, this.height * scale, 1)
    if (controlElement) { const perspective = 20 / (20 - this.mesh.position.z); const width = this.width * scale / this.viewport.width * screen.width * perspective; const height = this.height * scale / this.viewport.height * screen.height * perspective; const centerX = screen.width * .5 + x / this.viewport.width * screen.width * perspective; const centerY = screen.height * .5 - this.mesh.position.y / this.viewport.height * screen.height * perspective; const left = centerX + height * .5 * Math.sin(this.mesh.rotation.z); const bottom = centerY + height * .5 * Math.cos(this.mesh.rotation.z); controlElement.style.width = `${width}px`; controlElement.style.opacity = `${Math.max(.12, 1 - depth * .68)}`; controlElement.style.zIndex = `${Math.round(100 - depth * 50)}`; controlElement.style.transform = `translate3d(${left}px,${bottom}px,0) translate(-50%,-100%)`; controlElement.style.pointerEvents = depth < .9 ? 'auto' : 'none' }
  }
  destroy() { this.mesh.setParent(null) }
}

class GalleryApp {
  constructor(container, items, cardControlsRef) {
    this.container = container; this.items = items; this.cardControlsRef = cardControlsRef; this.scroll = { current: 0, target: 0, start: 0 }; this.frame = null; this.resizeFrame = null; this.isVisible = true
    this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 1.5) }); this.gl = this.renderer.gl; container.appendChild(this.gl.canvas)
    this.camera = new Camera(this.gl); this.camera.fov = 42; this.camera.position.z = 20; this.scene = new Transform(); this.geometry = new Plane(this.gl)
    this.resize(); this.cards = items.map((item, index) => new Card({ gl: this.gl, geometry: this.geometry, scene: this.scene, image: item.image, index, count: items.length, viewport: this.viewport }))
    this.onResize = () => { if (this.resizeFrame) return; this.resizeFrame = requestAnimationFrame(() => { this.resizeFrame = null; this.resize(); this.requestFrame() }) }
    this.onWheel = event => { event.preventDefault(); this.scroll.target += Math.sign(event.deltaY || event.deltaX) * this.viewport.width * .10; this.requestFrame() }
    this.onPointerDown = event => { this.dragging = true; this.startX = event.clientX; this.scroll.start = this.scroll.target; container.setPointerCapture?.(event.pointerId) }
    this.onPointerMove = event => { if (this.dragging) { this.scroll.target = this.scroll.start - (event.clientX - this.startX) * .012; this.requestFrame() } }
    this.onPointerUp = () => { this.dragging = false; this.snap(); this.requestFrame() }
    container.addEventListener('wheel', this.onWheel, { passive: false }); container.addEventListener('pointerdown', this.onPointerDown); container.addEventListener('pointermove', this.onPointerMove); container.addEventListener('pointerup', this.onPointerUp); container.addEventListener('pointercancel', this.onPointerUp); window.addEventListener('resize', this.onResize)
    this.visibilityObserver = new IntersectionObserver(([entry]) => { this.isVisible = entry.isIntersecting; if (this.isVisible) this.requestFrame() }, { threshold: 0 })
    this.visibilityObserver.observe(container); this.requestFrame()
  }
  requestFrame() { if (this.isVisible && this.frame === null) this.frame = requestAnimationFrame(() => this.update()) }
  resize() { const { width, height } = this.container.getBoundingClientRect(); this.screen = { width, height }; this.renderer.setSize(width, height); this.camera.perspective({ aspect: width / height }); const cameraHeight = 2 * Math.tan((this.camera.fov * Math.PI / 180) / 2) * this.camera.position.z; this.viewport = { width: cameraHeight * (width / height), height: cameraHeight }; this.cards?.forEach(card => card.resize(this.viewport)) }
  snap() { const pitch = this.cards[0]?.pitch || 1; this.scroll.target = Math.round(this.scroll.target / pitch) * pitch }
  update() { this.frame = null; if (!this.isVisible) return; this.scroll.current = lerp(this.scroll.current, this.scroll.target, .12); this.cards.forEach((card, index) => card.update(this.scroll.current, this.screen, this.cardControlsRef?.current[index])); this.renderer.render({ scene: this.scene, camera: this.camera }); if (Math.abs(this.scroll.current - this.scroll.target) > .01 || this.dragging) this.requestFrame() }
  destroy() { if (this.frame) cancelAnimationFrame(this.frame); if (this.resizeFrame) cancelAnimationFrame(this.resizeFrame); this.visibilityObserver?.disconnect(); this.cards.forEach(card => card.destroy()); this.container.removeEventListener('wheel', this.onWheel); this.container.removeEventListener('pointerdown', this.onPointerDown); this.container.removeEventListener('pointermove', this.onPointerMove); this.container.removeEventListener('pointerup', this.onPointerUp); this.container.removeEventListener('pointercancel', this.onPointerUp); window.removeEventListener('resize', this.onResize); this.gl.canvas.remove() }
}

export default function CircularGallery({ items, cardControlsRef }) {
  const ref = useRef(null); const [shouldMount, setShouldMount] = useState(false)
  useEffect(() => { if (!ref.current) return undefined; const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setShouldMount(true); observer.disconnect() } }, { rootMargin: '400px 0px' }); observer.observe(ref.current); return () => observer.disconnect() }, [])
  useEffect(() => { if (!ref.current || !items.length || !shouldMount) return undefined; const app = new GalleryApp(ref.current, items, cardControlsRef); return () => app.destroy() }, [items, cardControlsRef, shouldMount])
  return <div className="circular-gallery" ref={ref} role="region" tabIndex="0" aria-label="每日推荐，滚动或拖动浏览" />
}