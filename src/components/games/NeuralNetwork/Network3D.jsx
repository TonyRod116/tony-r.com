import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const LAYERS = [28, 64, 32, 10]
// Grid (cols, rows) per layer so each layer is a 2D plane in 3D space
const LAYER_GRIDS = [
  [7, 4],   // 28: 7x4
  [8, 8],   // 64: 8x8
  [8, 4],   // 32: 8x4
  [5, 2],   // 10: 5x2
]
const NEURON_SPACING = 0.22
const LAYER_SPACING = 2.8

function getActivationColor(activation, maxActivation) {
  if (activation == null || maxActivation === 0) return new THREE.Color(0x1e3a8a)
  const normalized = Math.max(-1, Math.min(1, activation / maxActivation))
  if (normalized < 0) return new THREE.Color(0x1e3a8a)
  const hue = 0.6 - normalized * 0.3
  const sat = 0.7 + normalized * 0.3
  const light = 0.4 + normalized * 0.4
  return new THREE.Color().setHSL(hue, sat, light)
}

function getWeightColor(weight) {
  const intensity = Math.min(1, Math.abs(weight))
  if (weight > 0) {
    return new THREE.Color().setHSL(0.1 - intensity * 0.1, 0.8, 0.5 + intensity * 0.3)
  }
  return new THREE.Color().setHSL(0.6 + intensity * 0.1, 0.8, 0.4 + intensity * 0.2)
}

function buildNetwork(scene, activations, weights, maxConnections, hideWeakConnections, connectionThickness) {
  const toRemove = []
  scene.traverse((obj) => {
    if (obj.userData?.isNetworkPart) toRemove.push(obj)
  })
  for (const obj of toRemove) {
    if (obj.geometry) obj.geometry.dispose()
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
      else obj.material.dispose()
    }
    scene.remove(obj)
  }

  const maxActivation = (() => {
    if (!activations) return 1
    let max = 0
    activations.forEach((layer) => {
      if (layer) layer.forEach((a) => { max = Math.max(max, Math.abs(a)) })
    })
    return max || 1
  })()

  const sampledActivations = activations
    ? activations.map((layer, layerIdx) => {
        if (!layer) return null
        if (layerIdx === 0) {
          const step = Math.floor(layer.length / 28)
          return layer.filter((_, i) => i % step === 0).slice(0, 28)
        }
        return layer
      })
    : null

  // Helper: index -> (x, y, z) for a layer plane. Layers along X; each layer is a YZ plane.
  const neuronPosition = (layerIndex, neuronIndex) => {
    const [cols, rows] = LAYER_GRIDS[layerIndex]
    const col = neuronIndex % cols
    const row = Math.floor(neuronIndex / cols)
    const x = (layerIndex - (LAYERS.length - 1) / 2) * LAYER_SPACING
    const y = (col - (cols - 1) / 2) * NEURON_SPACING
    const z = (row - (rows - 1) / 2) * NEURON_SPACING
    return new THREE.Vector3(x, y, z)
  }

  const w = weights || []
  for (let layerIndex = 0; layerIndex < LAYERS.length; layerIndex++) {
    const neuronCount = LAYERS[layerIndex]
    const layerActs = sampledActivations ? sampledActivations[layerIndex] : null
    const layerWeights = w[layerIndex]
    const nextCount = layerIndex < LAYERS.length - 1 ? LAYERS[layerIndex + 1] : 0

    for (let i = 0; i < neuronCount; i++) {
      const pos = neuronPosition(layerIndex, i)
      const activation = layerActs ? layerActs[i] : 0
      const color = getActivationColor(activation, maxActivation)
      const scale = activation != null && maxActivation
        ? 0.5 + (Math.abs(activation) / maxActivation) * 0.5
        : 1

      const geo = new THREE.SphereGeometry(0.12 * scale, 16, 16)
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.25
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.copy(pos)
      mesh.userData.isNetworkPart = true
      scene.add(mesh)

      if (layerWeights && nextCount > 0) {
        const connections = []
        for (let j = 0; j < nextCount; j++) {
          const weight = layerWeights[j][i]
          connections.push({ targetIndex: j, weight })
        }
        connections.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
        const top = connections.slice(0, maxConnections)

        for (const conn of top) {
          if (Math.abs(conn.weight) < hideWeakConnections) continue
          const from = pos.clone()
          const to = neuronPosition(layerIndex + 1, conn.targetIndex)
          const dir = new THREE.Vector3().subVectors(to, from)
          const length = dir.length()
          const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5)

          const cylGeo = new THREE.CylinderGeometry(
            connectionThickness * 0.008,
            connectionThickness * 0.008,
            length,
            8
          )
          const cylMat = new THREE.MeshStandardMaterial({
            color: getWeightColor(conn.weight),
            transparent: true,
            opacity: 0.35 + Math.abs(conn.weight) * 0.6
          })
          const cyl = new THREE.Mesh(cylGeo, cylMat)
          cyl.position.copy(mid)
          const up = new THREE.Vector3(0, 1, 0)
          cyl.quaternion.setFromUnitVectors(up, dir.clone().normalize())
          cyl.userData.isNetworkPart = true
          scene.add(cyl)
        }
      }
    }
  }
}

export default function Network3D({
  containerRef,
  activations,
  weights,
  maxConnections,
  hideWeakConnections,
  connectionThickness
}) {
  const sceneRef = useRef(null)
  const controlsRef = useRef(null)
  const rendererRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const container = containerRef?.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x111827)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
    camera.position.set(8, 4, 6)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enablePan = true
    controls.enableZoom = true
    controls.enableRotate = true
    controlsRef.current = controls

    const ambient = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambient)
    const point = new THREE.PointLight(0xffffff, 1)
    point.position.set(10, 10, 10)
    scene.add(point)

    const onResize = () => {
      if (!container || !camera || !renderer) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    buildNetwork(scene, activations, weights, maxConnections, hideWeakConnections, connectionThickness)

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      window.removeEventListener('resize', onResize)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      controls.dispose()
      renderer.dispose()
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
          else obj.material.dispose()
        }
      })
    }
  }, [containerRef])

  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    buildNetwork(scene, activations, weights, maxConnections, hideWeakConnections, connectionThickness)
  }, [activations, weights, maxConnections, hideWeakConnections, connectionThickness])

  return null
}
