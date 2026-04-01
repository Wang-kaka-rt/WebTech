import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import AboutSection from './components/AboutSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import ProductsSection from './components/ProductsSection'
import { DEFAULT_LANGUAGE, LANGUAGE_OPTIONS, TRANSLATIONS } from './i18n'
import useFadeInOnScroll from './hooks/useFadeInOnScroll'
import backgroundVideo from './resource/背景视频.mp4'
import wangZhenyuImage from './resource/人物/王振宇.png'
import douChengImage from './resource/人物/窦程.png'
import geZijianImage from './resource/人物/葛子健.png'
import iberexPartnerLogo from './resource/合作/iberex.png'
import tokPartnerLogo from './resource/合作/tok.png'
import ibizhongPartnerLogo from './resource/合作/伊比中新时代.png'

const sectionIds = ['hero', 'products', 'about', 'team', 'contact', 'partners']
const teamPhotos = [wangZhenyuImage, douChengImage, geZijianImage]
const productIcons = ['🧠', '⚙️', '💡', '🏭', '🛡️', '🌐']
const partnerLogos = [
  { src: iberexPartnerLogo, name: 'IBEREX', sizeClass: 'max-h-20' },
  { src: tokPartnerLogo, name: 'TOK', sizeClass: 'max-h-14' },
  { src: ibizhongPartnerLogo, name: '伊比中新时代', sizeClass: 'max-h-40' },
]

function App() {
  const canvasRef = useRef(null)
  const backgroundVideoRef = useRef(null)
  const introBlurLayerRef = useRef(null)
  const contentWrapperRef = useRef(null)
  const pageFxRef = useRef(null)
  const [language, setLanguage] = useState(() => {
    const saved = window.localStorage.getItem('lang')
    return saved && TRANSLATIONS[saved] ? saved : DEFAULT_LANGUAGE
  })
  const [isIntroDone, setIsIntroDone] = useState(false)
  const isTransitioningRef = useRef(false)
  const transitionTweenRef = useRef(null)
  const t = useMemo(() => TRANSLATIONS[language] ?? TRANSLATIONS[DEFAULT_LANGUAGE], [language])
  const languageSwitcher = useMemo(() => {
    const currentIndex = LANGUAGE_OPTIONS.findIndex((item) => item.code === language)
    const fallback = LANGUAGE_OPTIONS[0]
    if (currentIndex === -1) {
      return {
        currentLabel: fallback.label,
        nextLabel: fallback.label,
      }
    }
    const currentOption = LANGUAGE_OPTIONS[currentIndex] ?? fallback
    const nextOption = LANGUAGE_OPTIONS[(currentIndex + 1) % LANGUAGE_OPTIONS.length] ?? fallback
    return {
      currentLabel: currentOption.label,
      nextLabel: nextOption.label,
    }
  }, [language])
  const products = useMemo(
    () => t.products.items.map((item, index) => ({ ...item, icon: productIcons[index] ?? '✨' })),
    [t.products.items],
  )
  const coreTeam = useMemo(
    () => t.team.members.map((member, index) => ({ ...member, photo: teamPhotos[index] })),
    [t.team.members],
  )

  useFadeInOnScroll('.fade-in-section')

  useEffect(() => {
    window.localStorage.setItem('lang', language)
  }, [language])

  useEffect(() => {
    const backgroundVideoElement = backgroundVideoRef.current

    const startIntro = () => {
      window.requestAnimationFrame(() => setIsIntroDone(true))
    }

    if (backgroundVideoElement && backgroundVideoElement.readyState >= 2) {
      startIntro()
    } else if (backgroundVideoElement) {
      backgroundVideoElement.addEventListener('loadeddata', startIntro, { once: true })
    }

    return () => {
      if (backgroundVideoElement) {
        backgroundVideoElement.removeEventListener('loadeddata', startIntro)
      }
    }
  }, [])

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35))

    const world = new THREE.Group()
    scene.add(world)

    const waveUniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uDark: { value: new THREE.Color(0xfcfeff) },
      uMid: { value: new THREE.Color(0xf3f9ff) },
      uLight: { value: new THREE.Color(0xdceeff) },
      uAccent: { value: new THREE.Color(0x9fd2ff) },
    }

    const waveMaterial = new THREE.ShaderMaterial({
      uniforms: waveUniforms,
      transparent: true,
      depthWrite: false,
      vertexShader: `
        varying vec2 vUv;
        varying float vWave;
        uniform float uTime;

        void main() {
          vUv = uv;
          vec3 pos = position;
          float waveA = sin((pos.x * 0.58 + uTime * 0.86) * 1.8) * 0.08;
          float waveB = sin((pos.y * 1.2 - uTime * 0.95) * 2.2) * 0.05;
          float ribbonA = sin((pos.x * 0.32 + pos.y * 1.35 - uTime * 0.62) * 3.1) * 0.06;
          float ribbonB = sin((pos.x * 0.25 + pos.y * 1.08 - uTime * 0.5) * 4.4) * 0.025;
          float height = waveA + waveB + ribbonA + ribbonB;
          float sideFade = smoothstep(0.02, 0.18, uv.x) * smoothstep(0.02, 0.18, 1.0 - uv.x);
          pos.z += height * sideFade;
          vWave = height * sideFade;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying float vWave;
        uniform vec2 uResolution;
        uniform vec3 uDark;
        uniform vec3 uMid;
        uniform vec3 uLight;
        uniform vec3 uAccent;
        uniform float uTime;

        void main() {
          vec2 uv = vUv;
          vec2 screenUv = gl_FragCoord.xy / uResolution.xy;
          float t = uTime;
          float sideFade = smoothstep(0.03, 0.2, uv.x) * smoothstep(0.03, 0.2, 1.0 - uv.x);
          float baseMix = smoothstep(0.0, 1.0, uv.x * 0.46 + uv.y * 0.66);
          vec3 color = mix(uDark, uMid, baseMix);

          float ribbonMainCurve = 0.2 + uv.x * 0.48 + sin(uv.x * 6.2 + t * 0.9) * 0.025;
          float ribbonMain = smoothstep(0.13, 0.0, abs(uv.y - ribbonMainCurve));
          float ribbonSubCurve = 0.14 + uv.x * 0.44 + sin(uv.x * 7.4 + t * 1.15 + 0.65) * 0.02;
          float ribbonSub = smoothstep(0.08, 0.0, abs(uv.y - ribbonSubCurve));

          float coreLine = smoothstep(0.022, 0.0, abs(uv.y - ribbonMainCurve));
          float techPulse = 0.72 + 0.28 * sin(t * 1.7 + uv.x * 8.2);
          color += mix(uLight, uAccent, 0.45) * ribbonMain * (0.18 + techPulse * 0.15) * sideFade;
          color += mix(uMid, uLight, 0.7) * ribbonSub * 0.12 * sideFade;
          color += uAccent * coreLine * 0.26 * sideFade;

          float scan = sin((screenUv.y * 1080.0) + t * 7.5) * 0.5 + 0.5;
          color += uAccent * scan * 0.0045;

          vec2 gridUv = screenUv * vec2(24.0, 15.0);
          vec2 grid = abs(fract(gridUv - 0.5) - 0.5) / fwidth(gridUv);
          float gridLine = 1.0 - min(min(grid.x, grid.y), 1.0);
          color += vec3(0.05, 0.1, 0.18) * gridLine * 0.032;

          vec2 dotUv = fract(screenUv * vec2(36.0, 22.0));
          float dot = smoothstep(0.06, 0.0, length(dotUv - 0.5));
          color += vec3(0.07, 0.12, 0.2) * dot * 0.014;

          vec2 core = screenUv - vec2(0.82, 0.58);
          float coreDist = length(core);
          float coreGlow = smoothstep(0.34, 0.0, coreDist);
          float ring = smoothstep(0.21, 0.18, coreDist) - smoothstep(0.17, 0.14, coreDist);
          color += uLight * coreGlow * 0.12 * sideFade;
          color += uAccent * ring * (0.2 + 0.12 * sin(t * 2.2)) * sideFade;

          float waveHighlight = smoothstep(-0.02, 0.18, vWave) * 0.1;
          color += vec3(0.02, 0.06, 0.12) * waveHighlight;

          float vignette = smoothstep(0.92, 0.2, distance(screenUv, vec2(0.56, 0.52)));
          color *= mix(0.985, 1.015, vignette);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    })

    const waveSurface = new THREE.Mesh(new THREE.PlaneGeometry(40, 24, 210, 140), waveMaterial)
    waveSurface.position.set(0, 0, -6.5)
    world.add(waveSurface)

    const dimensionalCubes = []
    const cubeConfigs = [
      { size: 1.75, x: 5.5, y: 1.6, z: -3.3, speed: 0.56, phase: 0.3, moveX: 1.35, moveY: 0.52, moveZ: 0.36 },
      { size: 1.32, x: -5.2, y: -1.3, z: -3.9, speed: 0.68, phase: 1.0, moveX: 1.18, moveY: 0.44, moveZ: 0.32 },
      { size: 1.18, x: 2.8, y: -2.4, z: -3.0, speed: 0.76, phase: 2.1, moveX: 1.42, moveY: 0.56, moveZ: 0.42 },
      { size: 1.42, x: -2.1, y: 2.1, z: -3.4, speed: 0.6, phase: 2.7, moveX: 1.08, moveY: 0.48, moveZ: 0.34 },
      { size: 1.08, x: 0.9, y: 0.8, z: -2.7, speed: 0.84, phase: 3.2, moveX: 1.26, moveY: 0.4, moveZ: 0.3 },
      { size: 1.22, x: -7.0, y: 3.2, z: -3.5, speed: 0.62, phase: 4.1, moveX: 1.1, moveY: 0.36, moveZ: 0.3 },
      { size: 1.36, x: 7.3, y: 1.2, z: -3.6, speed: 0.58, phase: 4.8, moveX: 1.24, moveY: 0.42, moveZ: 0.34 },
      { size: 1.28, x: 7.1, y: -3.0, z: -3.7, speed: 0.66, phase: 5.3, moveX: 1.18, moveY: 0.46, moveZ: 0.36 },
    ]

    cubeConfigs.forEach((config) => {
      const cubeGroup = new THREE.Group()
      const cubeGeometry = new THREE.BoxGeometry(config.size, config.size, config.size)
      const cubeFillMaterial = new THREE.MeshBasicMaterial({
        color: 0xd9ecff,
        transparent: true,
        opacity: 0.16,
      })
      const cubeFill = new THREE.Mesh(cubeGeometry, cubeFillMaterial)
      const edgeGeometry = new THREE.EdgesGeometry(cubeGeometry)
      const edgeMaterial = new THREE.LineBasicMaterial({
        color: 0x79beff,
        transparent: true,
        opacity: 0.84,
      })
      const cubeEdges = new THREE.LineSegments(edgeGeometry, edgeMaterial)

      const coreGeometry = new THREE.BoxGeometry(config.size * 0.42, config.size * 0.42, config.size * 0.42)
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0xaed8ff,
        transparent: true,
        opacity: 0.34,
      })
      const cubeCore = new THREE.Mesh(coreGeometry, coreMaterial)

      cubeGroup.add(cubeFill)
      cubeGroup.add(cubeEdges)
      cubeGroup.add(cubeCore)
      cubeGroup.position.set(config.x, config.y, config.z)
      world.add(cubeGroup)
      dimensionalCubes.push({ group: cubeGroup, cubeFill, cubeEdges, cubeCore, ...config })
    })

    const megaCubeGeometry = new THREE.BoxGeometry(5.4, 5.4, 5.4)
    const megaCubeEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(megaCubeGeometry),
      new THREE.LineBasicMaterial({
        color: 0xd6ebff,
        transparent: true,
        opacity: 0.26,
      }),
    )
    megaCubeEdges.position.set(4.2, -0.2, -6.8)
    megaCubeEdges.rotation.set(0.55, 0.48, 0.12)
    world.add(megaCubeEdges)

    const technoGlyphs = []
    const glyphConfigs = [
      { size: 0.9, x: -6.2, y: 0.4, z: -3.0, speed: 0.74, phase: 0.4, moveX: 0.72, moveY: 0.26 },
      { size: 1.05, x: 6.5, y: -0.5, z: -3.2, speed: 0.62, phase: 1.3, moveX: 0.66, moveY: 0.3 },
      { size: 0.78, x: 3.8, y: 2.8, z: -3.6, speed: 0.86, phase: 2.2, moveX: 0.58, moveY: 0.22 },
      { size: 0.84, x: -3.9, y: -2.9, z: -3.4, speed: 0.7, phase: 2.9, moveX: 0.62, moveY: 0.25 },
    ]

    glyphConfigs.forEach((config) => {
      const glyphGroup = new THREE.Group()
      const octaEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.OctahedronGeometry(config.size * 0.55)),
        new THREE.LineBasicMaterial({
          color: 0x8ec6ff,
          transparent: true,
          opacity: 0.56,
        }),
      )

      const hexPoints = []
      for (let i = 0; i < 6; i += 1) {
        const angle = (i / 6) * Math.PI * 2
        hexPoints.push(
          new THREE.Vector3(Math.cos(angle) * config.size, Math.sin(angle) * config.size, 0),
        )
      }
      const hexLoop = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(hexPoints),
        new THREE.LineBasicMaterial({
          color: 0xa9d6ff,
          transparent: true,
          opacity: 0.46,
        }),
      )
      hexLoop.rotation.x = Math.PI * 0.25

      const triPoints = [
        new THREE.Vector3(0, config.size * 0.72, 0),
        new THREE.Vector3(-config.size * 0.62, -config.size * 0.5, 0),
        new THREE.Vector3(config.size * 0.62, -config.size * 0.5, 0),
      ]
      const triLoop = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(triPoints),
        new THREE.LineBasicMaterial({
          color: 0xc6e7ff,
          transparent: true,
          opacity: 0.36,
        }),
      )
      triLoop.rotation.y = Math.PI * 0.3

      glyphGroup.add(octaEdges)
      glyphGroup.add(hexLoop)
      glyphGroup.add(triLoop)
      glyphGroup.position.set(config.x, config.y, config.z)
      world.add(glyphGroup)
      technoGlyphs.push({ group: glyphGroup, octaEdges, hexLoop, triLoop, ...config })
    })

    const sparkCount = 180
    const sparkPositions = new Float32Array(sparkCount * 3)
    for (let i = 0; i < sparkCount; i += 1) {
      const i3 = i * 3
      sparkPositions[i3] = (Math.random() - 0.5) * 16
      sparkPositions[i3 + 1] = (Math.random() - 0.5) * 9
      sparkPositions[i3 + 2] = -5.2 - Math.random() * 2.2
    }
    const sparkGeometry = new THREE.BufferGeometry()
    sparkGeometry.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3))
    const sparkMaterial = new THREE.PointsMaterial({
      color: 0x9bd7ff,
      size: 0.035,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const sparks = new THREE.Points(sparkGeometry, sparkMaterial)
    world.add(sparks)

    const size = { width: 0, height: 0 }
    const updateSize = () => {
      size.width = window.innerWidth
      size.height = window.innerHeight
      camera.aspect = size.width / size.height
      camera.updateProjectionMatrix()
      renderer.setSize(size.width, size.height, false)
      waveUniforms.uResolution.value.set(size.width, size.height)
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    const clock = new THREE.Clock()
    let frameId = 0

    const render = () => {
      const elapsed = clock.getElapsedTime()
      waveUniforms.uTime.value = elapsed

      dimensionalCubes.forEach((cube) => {
        const pulse = 0.6 + 0.4 * Math.sin(elapsed * cube.speed * 1.8 + cube.phase)
        cube.group.position.x = cube.x + Math.sin(elapsed * cube.speed + cube.phase) * cube.moveX
        cube.group.position.y = cube.y + Math.sin(elapsed * cube.speed * 1.2 + cube.phase) * cube.moveY
        cube.group.position.z = cube.z + Math.cos(elapsed * cube.speed * 0.9 + cube.phase) * cube.moveZ
        cube.group.rotation.x = Math.sin(elapsed * cube.speed * 0.5 + cube.phase) * 0.14
        cube.group.rotation.y = Math.cos(elapsed * cube.speed * 0.45 + cube.phase) * 0.18
        cube.group.rotation.z = Math.sin(elapsed * cube.speed * 0.4 + cube.phase) * 0.12
        cube.cubeEdges.material.opacity = 0.58 + pulse * 0.34
        cube.cubeCore.material.opacity = 0.2 + pulse * 0.28
      })
      megaCubeEdges.rotation.y += 0.0012
      megaCubeEdges.rotation.x += 0.0008
      technoGlyphs.forEach((glyph) => {
        const pulse = 0.55 + 0.45 * Math.sin(elapsed * glyph.speed * 2 + glyph.phase)
        glyph.group.position.x = glyph.x + Math.sin(elapsed * glyph.speed + glyph.phase) * glyph.moveX
        glyph.group.position.y = glyph.y + Math.cos(elapsed * glyph.speed * 1.15 + glyph.phase) * glyph.moveY
        glyph.group.rotation.z += 0.0034 + glyph.speed * 0.001
        glyph.group.rotation.y -= 0.0024 + glyph.speed * 0.0008
        glyph.octaEdges.material.opacity = 0.36 + pulse * 0.28
        glyph.hexLoop.material.opacity = 0.24 + pulse * 0.24
        glyph.triLoop.material.opacity = 0.16 + pulse * 0.2
      })
      sparks.rotation.z += 0.00085
      sparks.rotation.y -= 0.00055

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
      dimensionalCubes.forEach((cube) => {
        cube.cubeFill.geometry.dispose()
        cube.cubeFill.material.dispose()
        cube.cubeEdges.geometry.dispose()
        cube.cubeEdges.material.dispose()
        cube.cubeCore.geometry.dispose()
        cube.cubeCore.material.dispose()
      })
      megaCubeGeometry.dispose()
      megaCubeEdges.geometry.dispose()
      megaCubeEdges.material.dispose()
      technoGlyphs.forEach((glyph) => {
        glyph.octaEdges.geometry.dispose()
        glyph.octaEdges.material.dispose()
        glyph.hexLoop.geometry.dispose()
        glyph.hexLoop.material.dispose()
        glyph.triLoop.geometry.dispose()
        glyph.triLoop.material.dispose()
      })
      sparkGeometry.dispose()
      sparkMaterial.dispose()
      waveSurface.geometry.dispose()
      waveMaterial.dispose()
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
    if (!isIntroDone) {
      return
    }
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
    const jumpDistance = Math.abs(nextIndex - currentIndex)
    const scrollDuration = Math.min(0.72, 0.48 + jumpDistance * 0.08)
    const targetRise = jumpDistance > 1 ? 48 : 34
    const shouldAnimateCurrent = Boolean(currentSection && currentSection !== target && currentIndex !== 0)
    if (!target) {
      return
    }

    if (transitionTweenRef.current) {
      transitionTweenRef.current.kill()
      transitionTweenRef.current = null
      isTransitioningRef.current = false
    }

    isTransitioningRef.current = true
    const transitionColor = ['59,130,246', '56,189,248', '99,102,241', '37,99,235', '29,78,216'][nextIndex]
    const gradientAnchor = direction > 0 ? '50% 56%' : '50% 44%'

    const scrollState = { y: window.scrollY }
    const transitionTimeline = gsap.timeline({
      onComplete: () => {
        if (pageFxElement) {
          pageFxElement.style.removeProperty('opacity')
          pageFxElement.style.removeProperty('transform')
          pageFxElement.style.removeProperty('background')
        }
        if (currentSection) {
          currentSection.style.removeProperty('z-index')
          currentSection.style.removeProperty('transform')
          currentSection.style.removeProperty('opacity')
          currentSection.style.removeProperty('will-change')
        }
        target.style.removeProperty('z-index')
        target.style.removeProperty('transform')
        target.style.removeProperty('opacity')
        target.style.removeProperty('will-change')
        isTransitioningRef.current = false
        transitionTweenRef.current = null
      },
    })

    if (pageFxElement) {
      gsap.killTweensOf(pageFxElement)
      transitionTimeline.set(
        pageFxElement,
        {
          background: `radial-gradient(circle at ${gradientAnchor}, rgba(${transitionColor},0.2), rgba(15,23,42,0) 64%)`,
        },
        0,
      )
      transitionTimeline.fromTo(
        pageFxElement,
        {
          opacity: 0,
          scale: 0.98,
        },
        {
          opacity: 0.42,
          scale: 1.01,
          duration: scrollDuration * 0.38,
          ease: 'sine.out',
          overwrite: 'auto',
        },
        0,
      )
      transitionTimeline.to(
        pageFxElement,
        {
          opacity: 0,
          scale: 1.03,
          duration: scrollDuration * 0.62,
          ease: 'sine.in',
        },
        scrollDuration * 0.18,
      )
    }

    transitionTimeline.to(
      scrollState,
      {
        y: Math.max(target.offsetTop, 0),
        duration: scrollDuration,
        ease: 'power3.out',
        onUpdate: () => {
          window.scrollTo(0, scrollState.y)
        },
      },
      0,
    )

    if (shouldAnimateCurrent) {
      transitionTimeline.fromTo(
        currentSection,
        {
          opacity: 1,
          zIndex: 25,
          willChange: 'opacity',
        },
        {
          opacity: 0.72,
          duration: Math.max(0.18, scrollDuration * 0.46),
          ease: 'sine.out',
        },
        0,
      )
    }

    transitionTimeline.fromTo(
      target,
      {
        y: direction > 0 ? targetRise : -targetRise,
        opacity: 0.78,
        scale: 0.985,
        zIndex: 30,
        willChange: 'transform, opacity',
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: Math.max(0.34, scrollDuration * 0.82),
        ease: 'power3.out',
      },
      0,
    )

    transitionTweenRef.current = transitionTimeline

    const revealItems = target.querySelectorAll('.reveal-item')
    if (revealItems.length) {
      gsap.killTweensOf(revealItems)
      gsap.fromTo(
        revealItems,
        {
          y: 18,
          opacity: 0.35,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.28,
          delay: jumpDistance > 1 ? 0.06 : 0.02,
          stagger: 0.03,
          ease: 'power2.out',
          overwrite: 'auto',
        },
      )
    }
  }, [getCurrentIndex, isIntroDone])

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

  const handleLanguageCycle = useCallback(() => {
    setLanguage((currentLanguage) => {
      const currentIndex = LANGUAGE_OPTIONS.findIndex((item) => item.code === currentLanguage)
      if (currentIndex === -1) {
        return DEFAULT_LANGUAGE
      }
      return LANGUAGE_OPTIONS[(currentIndex + 1) % LANGUAGE_OPTIONS.length].code
    })
  }, [])

  useEffect(
    () => () => {
      if (transitionTweenRef.current) {
        transitionTweenRef.current.kill()
      }
    },
    [],
  )

  return (
    <div className="relative min-h-screen bg-transparent">
      <video
        ref={backgroundVideoRef}
        className="pointer-events-none fixed inset-0 z-0 h-full w-full object-cover"
        src={backgroundVideo}
        autoPlay
        muted
        playsInline
        onEnded={() => setIsIntroDone(true)}
        onError={() => setIsIntroDone(true)}
      ></video>
      <div
        className={`pointer-events-none fixed inset-0 z-10 transition-opacity duration-700 ${
          isIntroDone ? 'bg-slate-950/18' : 'bg-transparent'
        }`}
      ></div>
      <div
        className={`pointer-events-none fixed inset-0 z-[15] transition-opacity duration-700 ${
          isIntroDone ? 'opacity-100' : 'opacity-40'
        }`}
        style={{
          backgroundImage:
            'linear-gradient(136deg, rgba(8,34,92,0.58) 0%, rgba(12,66,168,0.28) 35%, rgba(5,20,56,0.66) 100%), linear-gradient(123deg, rgba(255,255,255,0) 26%, rgba(255,255,255,0.18) 44%, rgba(255,255,255,0) 58%)',
        }}
      ></div>
      <div ref={pageFxRef} className="pointer-events-none fixed inset-0 z-20 opacity-0"></div>
      <div
        ref={introBlurLayerRef}
        className={`pointer-events-none fixed inset-0 z-[25] transition-opacity duration-700 ${
          isIntroDone ? 'backdrop-blur-md bg-white/16 opacity-100' : 'bg-transparent opacity-0'
        }`}
      ></div>
      <div
        ref={contentWrapperRef}
        className={`relative z-30 transition-opacity duration-700 ${
          isIntroDone ? 'opacity-100' : 'pointer-events-none select-none opacity-0'
        }`}
      >
        <Navbar
          links={t.nav}
          onNavigate={handleNavigate}
          onLanguageCycle={handleLanguageCycle}
          currentLanguageLabel={languageSwitcher.currentLabel}
          nextLanguageLabel={languageSwitcher.nextLabel}
          switchLanguageLabel={t.switchLanguage}
        />
        <div className="relative z-10">
          <main>
            <Hero content={t.hero} />
            <ProductsSection products={products} content={t.products} />
            <AboutSection content={t.about} />
            <section
              id="team"
              className="team-section fade-in-section flex min-h-[100svh] items-center py-10 sm:py-12 lg:py-14 xl:py-16"
            >
              <div className="team-shell mx-auto -mt-1 w-full max-w-6xl px-6 sm:-mt-2 lg:-mt-3 xl:-mt-6 2xl:-mt-10 lg:px-8">
                <p className="team-badge reveal-item text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100/95 drop-shadow-[0_2px_8px_rgba(2,8,24,0.55)]">
                  {t.team.badge}
                </p>
                <h2 className="team-title reveal-item mt-4 text-3xl font-semibold tracking-tight text-white drop-shadow-[0_4px_14px_rgba(2,8,24,0.65)] sm:text-4xl">
                  {t.team.title}
                </h2>
                <p className="team-description reveal-item mt-6 max-w-3xl text-base leading-7 text-slate-100 drop-shadow-[0_2px_10px_rgba(2,8,24,0.55)] sm:text-lg">
                  {t.team.description}
                </p>
                <div className="team-grid mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {coreTeam.map((member) => (
                    <article
                      key={member.name}
                      className="team-card reveal-item flex h-full flex-col rounded-2xl bg-gradient-to-b from-transparent via-white/65 to-white/65 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card xl:p-5"
                    >
                      <div className="mb-4">
                        <img
                          src={member.photo}
                          alt={member.name}
                          className="team-photo h-40 w-full object-contain drop-shadow-[0_14px_22px_rgba(15,23,42,0.2)] sm:h-44 lg:h-48 xl:h-52"
                        />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">{member.title}</p>
                      <h3 className="team-name mt-2 text-2xl font-semibold text-slate-900">{member.name}</h3>
                      <p className="team-member-description mt-2 text-sm leading-6 text-slate-600">{member.description}</p>
                      <p className="team-experience mt-auto pt-3 text-sm font-semibold text-slate-700">{member.experience}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>
            <ContactSection content={t.contact} />
            <section
              id="partners"
              className="fade-in-section flex min-h-[100svh] items-center py-16 lg:py-24"
            >
              <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
                <p className="reveal-item text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100/95 drop-shadow-[0_2px_8px_rgba(2,8,24,0.55)]">
                  {t.partners.badge}
                </p>
                <h2 className="reveal-item mt-4 text-3xl font-semibold tracking-tight text-white drop-shadow-[0_4px_14px_rgba(2,8,24,0.65)] sm:text-4xl">
                  {t.partners.title}
                </h2>
                <p className="reveal-item mt-6 max-w-3xl text-base leading-7 text-slate-100 drop-shadow-[0_2px_10px_rgba(2,8,24,0.55)] sm:text-lg">
                  {t.partners.description}
                </p>
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {partnerLogos.map((partner) => (
                    <article
                      key={partner.name}
                      className="reveal-item flex h-32 items-center justify-center bg-transparent p-4 transition-all duration-300 hover:-translate-y-1"
                    >
                      <img
                        src={partner.src}
                        alt={partner.name}
                        className={`${partner.sizeClass} w-full object-contain`}
                      />
                    </article>
                  ))}
                </div>
              </div>
            </section>
          </main>
          <Footer content={t.footer} />
        </div>
      </div>
    </div>
  )
}

export default App
