import { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import AboutSection from './components/AboutSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import ProductsSection from './components/ProductsSection'
import TechnologySection from './components/TechnologySection'
import { advantages, navLinks, products } from './data/content'
import useFadeInOnScroll from './hooks/useFadeInOnScroll'

const sectionIds = ['hero', 'products', 'technology', 'about', 'contact']

function App() {
  const canvasRef = useRef(null)
  const pageFxRef = useRef(null)
  const isTransitioningRef = useRef(false)
  const transitionTweenRef = useRef(null)
  const wheelLockRef = useRef(false)
  const wheelUnlockTimerRef = useRef(null)
  const wheelCooldownUntilRef = useRef(0)

  useFadeInOnScroll('.fade-in-section')

  useEffect(() => {
    const canvasElement = canvasRef.current
    if (!canvasElement) {
      return undefined
    }

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0xeaf2ff, 12, 34)

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0, 13)

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasElement,
      alpha: true,
      antialias: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))

    const world = new THREE.Group()
    scene.add(world)

    const pointsGeometry = new THREE.BufferGeometry()
    const pointCount = 1800
    const pointPositions = new Float32Array(pointCount * 3)
    for (let i = 0; i < pointCount; i += 1) {
      const i3 = i * 3
      pointPositions[i3] = (Math.random() - 0.5) * 24
      pointPositions[i3 + 1] = (Math.random() - 0.5) * 16
      pointPositions[i3 + 2] = (Math.random() - 0.5) * 20
    }
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3))

    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x5aa2ff,
      size: 0.028,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
      depthWrite: false,
    })
    const points = new THREE.Points(pointsGeometry, pointsMaterial)
    world.add(points)

    const wireMaterial = new THREE.MeshStandardMaterial({
      color: 0xc7dcff,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.08,
      roughness: 0.22,
      metalness: 0.72,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    })

    const torusMesh = new THREE.Mesh(new THREE.TorusKnotGeometry(2.2, 0.36, 260, 24), wireMaterial)
    torusMesh.position.set(5.2, -2, -6)
    world.add(torusMesh)

    const icosahedronMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.7, 1), wireMaterial.clone())
    icosahedronMesh.material.opacity = 0.16
    icosahedronMesh.position.set(-5.5, 2.5, -7)
    world.add(icosahedronMesh)

    const ambientLight = new THREE.AmbientLight(0xe0ecff, 0.88)
    scene.add(ambientLight)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2)
    keyLight.position.set(4, 5, 8)
    scene.add(keyLight)
    const fillLight = new THREE.PointLight(0x60a5fa, 0.55, 42)
    fillLight.position.set(-5, -3, 6)
    scene.add(fillLight)

    const size = { width: 0, height: 0 }
    const updateSize = () => {
      size.width = window.innerWidth
      size.height = window.innerHeight
      camera.aspect = size.width / size.height
      camera.updateProjectionMatrix()
      renderer.setSize(size.width, size.height, false)
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    const clock = new THREE.Clock()
    let frameId = 0

    const render = () => {
      const elapsed = clock.getElapsedTime()

      points.rotation.y = elapsed * 0.015
      points.rotation.x = elapsed * 0.008
      torusMesh.rotation.x = elapsed * 0.14
      torusMesh.rotation.y = elapsed * 0.18
      icosahedronMesh.rotation.x = -elapsed * 0.12
      icosahedronMesh.rotation.y = elapsed * 0.1

      camera.position.x = 0
      camera.position.y = 0
      camera.lookAt(0, 0, -5)

      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.removeEventListener('resize', updateSize)
      window.cancelAnimationFrame(frameId)
      pointsGeometry.dispose()
      pointsMaterial.dispose()
      torusMesh.geometry.dispose()
      torusMesh.material.dispose()
      icosahedronMesh.geometry.dispose()
      icosahedronMesh.material.dispose()
      renderer.dispose()
    }
  }, [])

  const getCurrentIndex = useCallback(() => {
    const cursor = window.scrollY + window.innerHeight * 0.35
    let currentIndex = 0
    sectionIds.forEach((id, index) => {
      const section = document.getElementById(id)
      if (section && cursor >= section.offsetTop) {
        currentIndex = index
      }
    })
    return currentIndex
  }, [])

  const playPageTransition = useCallback((nextIndex, direction = 1) => {
    if (nextIndex < 0 || nextIndex >= sectionIds.length) {
      return
    }

    const currentIndex = getCurrentIndex()
    if (nextIndex === currentIndex) {
      return
    }

    const currentSection = document.getElementById(sectionIds[currentIndex])
    const target = document.getElementById(sectionIds[nextIndex])
    const pageFxElement = pageFxRef.current
    if (!target) {
      return
    }

    if (transitionTweenRef.current) {
      transitionTweenRef.current.kill()
      transitionTweenRef.current = null
      isTransitioningRef.current = false
    }

    isTransitioningRef.current = true
    wheelCooldownUntilRef.current = performance.now() + 760
    window.scrollTo({ top: target.offsetTop, behavior: 'auto' })

    const transitionColor = ['59,130,246', '56,189,248', '99,102,241', '37,99,235', '29,78,216'][nextIndex]
    if (pageFxElement) {
      gsap.fromTo(
        pageFxElement,
        {
          opacity: 0,
          scale: 0.96,
          background: `radial-gradient(circle at center, rgba(${transitionColor},0.22), rgba(15,23,42,0) 62%)`,
        },
        {
          opacity: 0.78,
          scale: 1.05,
          duration: 0.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: 1,
        },
      )
    }

    const transitionTimeline = gsap.timeline({
      onComplete: () => {
        if (currentSection) {
          currentSection.style.removeProperty('z-index')
          currentSection.style.removeProperty('clip-path')
          currentSection.style.removeProperty('transform')
          currentSection.style.removeProperty('opacity')
          currentSection.style.removeProperty('filter')
        }
        target.style.removeProperty('z-index')
        target.style.removeProperty('clip-path')
        target.style.removeProperty('transform')
        target.style.removeProperty('opacity')
        target.style.removeProperty('filter')
        isTransitioningRef.current = false
        transitionTweenRef.current = null
      },
    })

    if (currentSection && currentSection !== target) {
      transitionTimeline.fromTo(
        currentSection,
        {
          yPercent: 0,
          opacity: 1,
          filter: 'brightness(1) blur(0px)',
          clipPath: 'inset(0 0 0 0)',
          zIndex: 25,
        },
        {
          yPercent: direction > 0 ? -8 : 8,
          opacity: 0.46,
          clipPath: direction > 0 ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)',
          filter: 'brightness(0.9) blur(3px)',
          duration: 0.34,
          ease: 'power2.in',
        },
      )
    }

    transitionTimeline.fromTo(
      target,
      {
        yPercent: direction > 0 ? 10 : -10,
        clipPath: direction > 0 ? 'inset(100% 0 0 0)' : 'inset(0 0 100% 0)',
        filter: 'brightness(1.16) blur(4px)',
        opacity: 0.72,
        zIndex: 30,
      },
      {
        yPercent: 0,
        clipPath: 'inset(0 0 0 0)',
        filter: 'brightness(1) blur(0px)',
        opacity: 1,
        duration: 0.58,
        ease: 'power3.out',
      },
      currentSection && currentSection !== target ? '-=0.08' : 0,
    )

    transitionTweenRef.current = transitionTimeline

    const revealItems = target.querySelectorAll('.reveal-item')
    if (revealItems.length) {
      gsap.fromTo(
        revealItems,
        {
          y: 24,
          opacity: 0.25,
          filter: 'blur(8px)',
        },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.5,
          delay: 0.16,
          stagger: 0.045,
          ease: 'power2.out',
        },
      )
    }
  }, [getCurrentIndex])

  const handleNavigate = useCallback((href) => {
    const id = href.replace('#', '')
    const targetIndex = sectionIds.indexOf(id)
    if (targetIndex === -1) {
      return
    }
    const current = getCurrentIndex()
    const direction = targetIndex >= current ? 1 : -1
    playPageTransition(targetIndex, direction)
  }, [getCurrentIndex, playPageTransition])

  useEffect(() => {
    const handleWheel = (event) => {
      if (wheelUnlockTimerRef.current) {
        window.clearTimeout(wheelUnlockTimerRef.current)
      }
      wheelUnlockTimerRef.current = window.setTimeout(() => {
        wheelLockRef.current = false
      }, 240)

      if (performance.now() < wheelCooldownUntilRef.current) {
        event.preventDefault()
        return
      }

      if (isTransitioningRef.current) {
        event.preventDefault()
        return
      }

      if (wheelLockRef.current) {
        event.preventDefault()
        return
      }

      if (Math.abs(event.deltaY) < 16) {
        return
      }

      wheelLockRef.current = true
      const nextDirection = event.deltaY > 0 ? 1 : -1
      const current = getCurrentIndex()
      const next = current + nextDirection
      if (next < 0 || next >= sectionIds.length) {
        return
      }

      event.preventDefault()
      playPageTransition(next, nextDirection)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      if (wheelUnlockTimerRef.current) {
        window.clearTimeout(wheelUnlockTimerRef.current)
      }
      if (transitionTweenRef.current) {
        transitionTweenRef.current.kill()
      }
    }
  }, [getCurrentIndex, playPageTransition])

  return (
    <div className="relative min-h-screen bg-slate-50">
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 h-full w-full"></canvas>
      <div ref={pageFxRef} className="pointer-events-none fixed inset-0 z-20 opacity-0"></div>
      <Navbar links={navLinks} onNavigate={handleNavigate} />
      <div className="relative z-10 pt-12 lg:pt-0">
        <main>
          <Hero />
          <ProductsSection products={products} />
          <TechnologySection advantages={advantages} />
          <AboutSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
