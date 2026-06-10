import * as THREE from 'three'
import { globeNodes } from '../data'

const TIER_COLORS: Record<string, number> = {
  A: 0x22d39b,
  B: 0x2dd4bf,
  C: 0x5c9cff,
  D: 0x9ca3ff,
}

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

function greatCirclePoints(
  start: THREE.Vector3,
  end: THREE.Vector3,
  count: number,
  altitude: number
): THREE.Vector3[] {
  const points: THREE.Vector3[] = []
  for (let i = 0; i <= count; i++) {
    const t = i / count
    const pos = new THREE.Vector3().lerpVectors(start, end, t).normalize()
    const sag = Math.sin(Math.PI * t) * altitude
    pos.multiplyScalar(start.length() + sag)
    points.push(pos)
  }
  return points
}

interface Arc {
  line: THREE.Line
  progress: number
  speed: number
  length: number
  points: THREE.Vector3[]
  tier: string
  active: boolean
  waitTime: number
}

export class GlobeScene {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  globe!: THREE.Mesh
  dotCloud!: THREE.Points
  particleCloud!: THREE.Points
  nodeGroup!: THREE.Group
  arcGroup!: THREE.Group
  arcs: Arc[] = []

  private isDragging = false
  private prevMouse = { x: 0, y: 0 }
  private rotVel = { x: 0, y: 0 }
  private rotTarget = { x: 0.15, y: 0 }
  private rotCurrent = { x: 0.15, y: 0 }
  private autoRotate = true
  private destroyed = false
  private rafId = 0
  private canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    this.renderer.setClearColor(0x000000, 0)

    this.scene = new THREE.Scene()

    const aspect = canvas.clientWidth / canvas.clientHeight
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000)
    this.camera.position.set(0, 0, 3.2)

    this.build()
    this.bindEvents()
    this.animate()
  }

  private build() {
    this.buildGlobe()
    this.buildDotCloud()
    this.buildParticles()
    this.buildNodes()
    this.buildArcs()
    this.buildAmbientLight()
  }

  private buildGlobe() {
    const geo = new THREE.SphereGeometry(1, 64, 64)

    // Dark sphere base
    const mat = new THREE.MeshPhongMaterial({
      color: 0x080d2c,
      emissive: 0x0a1040,
      shininess: 15,
      transparent: true,
      opacity: 0.92,
    })
    this.globe = new THREE.Mesh(geo, mat)
    this.scene.add(this.globe)

    // Wireframe overlay
    const wGeo = new THREE.SphereGeometry(1.001, 32, 32)
    const wMat = new THREE.MeshBasicMaterial({
      color: 0x1a2a6c,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    })
    this.scene.add(new THREE.Mesh(wGeo, wMat))

    // Atmosphere glow
    const atmGeo = new THREE.SphereGeometry(1.18, 64, 64)
    const atmMat = new THREE.ShaderMaterial({
      uniforms: { color: { value: new THREE.Color(0x5c9cff) } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 3.0);
          gl_FragColor = vec4(color, intensity * 0.6);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    })
    this.scene.add(new THREE.Mesh(atmGeo, atmMat))
  }

  private buildDotCloud() {
    // Dots representing land masses (simplified using cosine-weighted random distribution
    // then culled to land — we use a basic continents heuristic via noise)
    const count = 8000
    const positions: number[] = []
    const colors: number[] = []
    const col = new THREE.Color()

    for (let i = 0; i < count; i++) {
      // Random point on sphere
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.005

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.cos(phi)
      const z = r * Math.sin(phi) * Math.sin(theta)

      positions.push(x, y, z)

      // Vary dot color slightly
      const brightness = 0.15 + Math.random() * 0.1
      col.setRGB(brightness, brightness + 0.05, brightness + 0.15)
      colors.push(col.r, col.g, col.b)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const mat = new THREE.PointsMaterial({
      size: 0.008,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    this.dotCloud = new THREE.Points(geo, mat)
    this.scene.add(this.dotCloud)
  }

  private buildParticles() {
    const count = 1500
    const positions: number[] = []

    for (let i = 0; i < count; i++) {
      const r = 1.8 + Math.random() * 1.4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      )
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

    const mat = new THREE.PointsMaterial({
      size: 0.005,
      color: 0x5c9cff,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    this.particleCloud = new THREE.Points(geo, mat)
    this.scene.add(this.particleCloud)
  }

  private buildNodes() {
    this.nodeGroup = new THREE.Group()
    this.scene.add(this.nodeGroup)

    globeNodes.forEach((node) => {
      const pos = latLngToVec3(node.lat, node.lng, 1.02)
      const color = TIER_COLORS[node.tier]

      // Glow ring
      const ringGeo = new THREE.RingGeometry(0.018, 0.028, 16)
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.position.copy(pos)
      ring.lookAt(new THREE.Vector3(0, 0, 0))
      this.nodeGroup.add(ring)

      // Core dot
      const dotGeo = new THREE.CircleGeometry(0.012, 12)
      const dotMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const dot = new THREE.Mesh(dotGeo, dotMat)
      dot.position.copy(pos)
      dot.lookAt(new THREE.Vector3(0, 0, 0))
      this.nodeGroup.add(dot)
    })
  }

  private buildArcs() {
    this.arcGroup = new THREE.Group()
    this.scene.add(this.arcGroup)
    this.spawnArcs(6)
  }

  private spawnArcs(n: number) {
    const nodes = globeNodes
    for (let i = 0; i < n; i++) {
      this.spawnArc(nodes)
    }
  }

  private spawnArc(nodes: typeof globeNodes) {
    const a = nodes[Math.floor(Math.random() * nodes.length)]
    let b = nodes[Math.floor(Math.random() * nodes.length)]
    while (b === a) b = nodes[Math.floor(Math.random() * nodes.length)]

    const startVec = latLngToVec3(a.lat, a.lng, 1.02)
    const endVec = latLngToVec3(b.lat, b.lng, 1.02)

    const dist = startVec.distanceTo(endVec)
    const altitude = dist * 0.35 + 0.1
    const segCount = 60
    const points = greatCirclePoints(startVec, endVec, segCount, altitude)

    const color = new THREE.Color(TIER_COLORS[a.tier])

    // Gradient line using dashed-style via custom shader
    const geo = new THREE.BufferGeometry().setFromPoints(points)

    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      linewidth: 1,
    })

    const line = new THREE.Line(geo, mat)
    this.arcGroup.add(line)

    const arc: Arc = {
      line,
      progress: 0,
      speed: 0.004 + Math.random() * 0.003,
      length: segCount,
      points,
      tier: a.tier,
      active: false,
      waitTime: Math.random() * 2,
    }

    this.arcs.push(arc)
  }

  private buildAmbientLight() {
    this.scene.add(new THREE.AmbientLight(0x1a2a6c, 2))
    const dir = new THREE.DirectionalLight(0x5c9cff, 1.5)
    dir.position.set(5, 3, 5)
    this.scene.add(dir)
    const back = new THREE.DirectionalLight(0x7b61ff, 0.5)
    back.position.set(-5, -3, -5)
    this.scene.add(back)
  }

  private bindEvents() {
    const c = this.canvas

    const onPointerDown = (e: PointerEvent) => {
      this.isDragging = true
      this.autoRotate = false
      this.prevMouse = { x: e.clientX, y: e.clientY }
      this.rotVel = { x: 0, y: 0 }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!this.isDragging) return
      const dx = e.clientX - this.prevMouse.x
      const dy = e.clientY - this.prevMouse.y
      this.rotVel.y = dx * 0.003
      this.rotVel.x = dy * 0.003
      this.rotTarget.y += dx * 0.003
      this.rotTarget.x += dy * 0.003
      this.rotTarget.x = Math.max(-0.5, Math.min(0.5, this.rotTarget.x))
      this.prevMouse = { x: e.clientX, y: e.clientY }
    }

    const onPointerUp = () => {
      this.isDragging = false
      setTimeout(() => {
        this.autoRotate = true
      }, 2000)
    }

    c.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    window.addEventListener('resize', this.onResize)
  }

  private onResize = () => {
    const c = this.canvas
    const w = c.clientWidth
    const h = c.clientHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }

  setScale(s: number) {
    this.scene.scale.setScalar(s)
  }

  private updateArcs(dt: number) {
    if (this.arcs.length < 12) {
      this.spawnArcs(2)
    }

    for (let i = this.arcs.length - 1; i >= 0; i--) {
      const arc = this.arcs[i]
      const mat = arc.line.material as THREE.LineBasicMaterial

      if (!arc.active) {
        arc.waitTime -= dt
        if (arc.waitTime <= 0) arc.active = true
        continue
      }

      arc.progress += arc.speed

      if (arc.progress >= 1) {
        this.arcGroup.remove(arc.line)
        arc.line.geometry.dispose()
        ;(arc.line.material as THREE.Material).dispose()
        this.arcs.splice(i, 1)
        this.spawnArcs(1)
        continue
      }

      // Fade in and out
      const fadeIn = Math.min(arc.progress * 6, 1)
      const fadeOut = arc.progress > 0.7 ? 1 - ((arc.progress - 0.7) / 0.3) : 1
      mat.opacity = fadeIn * fadeOut * 0.85

      // Draw partial geometry (head of arc)
      const visible = Math.floor(arc.progress * arc.length)
      const tail = Math.max(0, visible - 15)
      const subPoints = arc.points.slice(tail, visible + 1)
      if (subPoints.length > 1) {
        arc.line.geometry.setFromPoints(subPoints)
        arc.line.geometry.attributes.position.needsUpdate = true
      }
    }
  }

  private clock = new THREE.Clock()
  private t = 0

  private animate = () => {
    if (this.destroyed) return
    this.rafId = requestAnimationFrame(this.animate)

    const dt = this.clock.getDelta()
    this.t += dt

    // Auto-rotate
    if (this.autoRotate) {
      this.rotTarget.y += 0.0015
    }

    // Inertia
    this.rotVel.x *= 0.92
    this.rotVel.y *= 0.92

    // Smooth follow
    this.rotCurrent.x += (this.rotTarget.x - this.rotCurrent.x) * 0.06
    this.rotCurrent.y += (this.rotTarget.y - this.rotCurrent.y) * 0.06

    this.globe.rotation.x = this.rotCurrent.x
    this.globe.rotation.y = this.rotCurrent.y
    this.dotCloud.rotation.x = this.rotCurrent.x
    this.dotCloud.rotation.y = this.rotCurrent.y
    this.nodeGroup.rotation.x = this.rotCurrent.x
    this.nodeGroup.rotation.y = this.rotCurrent.y
    this.arcGroup.rotation.x = this.rotCurrent.x
    this.arcGroup.rotation.y = this.rotCurrent.y

    // Particle drift
    this.particleCloud.rotation.y = this.t * 0.04
    this.particleCloud.rotation.x = Math.sin(this.t * 0.02) * 0.05

    // Node pulse
    this.nodeGroup.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh
      const mat = mesh.material as THREE.MeshBasicMaterial
      if (mat && mat.opacity !== undefined) {
        mat.opacity = 0.5 + Math.sin(this.t * 1.5 + i * 0.7) * 0.3
      }
    })

    this.updateArcs(dt)

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.destroyed = true
    cancelAnimationFrame(this.rafId)
    this.renderer.dispose()
    window.removeEventListener('resize', this.onResize)
  }
}
