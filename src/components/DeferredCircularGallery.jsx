import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const CircularGallery = lazy(() => import('./CircularGallery'))

export default function DeferredCircularGallery(props) {
  const ref = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (!ref.current) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true)
        observer.disconnect()
      }
    }, { rootMargin: '450px 0px' })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return <div className="deferred-circular-gallery" ref={ref}>{shouldLoad && <Suspense fallback={null}><CircularGallery {...props} /></Suspense>}</div>
}