import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Configuración según el repositorio original
const VISUALIZER_CONFIG = {
  layerSpacing: 5.5,
  inputSpacing: 0.24,
  hiddenSpacing: 0.95,
  outputSpacing: 0.95,
  inputNodeSize: 0.18,
  hiddenNodeRadius: 0.22,
  connectionRadius: 0.012,
}

// Función para calcular grids dinámicamente basado en la arquitectura
function calculateLayerGrids(architecture) {
  if (!architecture || architecture.length === 0) {
    // Valores por defecto según especificaciones: 784 -> 64 -> 32 -> 10
    return {
      layers: [784, 64, 32, 10],
      grids: [
        [28, 28], // 784: 28x28 (TODAS las neuronas visibles, como el original)
        [8, 8],   // 64: 8x8
        [8, 4],   // 32: 8x4
        [10, 1],  // 10: línea vertical (output layer)
      ]
    }
  }
  
  const grids = architecture.map((size, idx) => {
    if (idx === 0) {
      // Input layer: mostrar todas las neuronas en grid 28×28
      if (size === 784) {
        return [28, 28]
      }
      // Si no es exactamente 784, calcular grid cuadrado
      const sqrt = Math.ceil(Math.sqrt(size))
      return [sqrt, Math.ceil(size / sqrt)]
    }
    if (idx === architecture.length - 1) {
      // Output layer: línea vertical
      return [size, 1]
    }
    // Hidden layers: calcular grid razonable
    const sqrt = Math.ceil(Math.sqrt(size))
    const cols = sqrt
    const rows = Math.ceil(size / cols)
    return [cols, rows]
  })
  
  return { layers: architecture, grids }
}

function getActivationColor(activation, maxActivation, isInputLayer = false) {
  if (activation == null || maxActivation === 0) {
    // Color base oscuro
    return isInputLayer ? new THREE.Color(0.15, 0.15, 0.15) : new THREE.Color(0.15, 0.15, 0.15)
  }
  
  if (isInputLayer) {
    // Input layer: escala de grises (blanco/negro) como el original
    const normalized = Math.max(0, Math.min(1, activation / maxActivation))
    return new THREE.Color(normalized, normalized, normalized)
  }
  
  // Hidden/Output layers: escala de grises basada en activación normalizada
  const normalized = Math.max(0, Math.min(1, activation / maxActivation))
  return new THREE.Color(normalized, normalized, normalized)
}

function getWeightColor(weight, contribution = null, maxContribution = null) {
  // Si tenemos información de contribución (activation * weight), mapear magnitud a gris -> verde
  if (contribution !== null && maxContribution !== null && maxContribution > 1e-6) {
    const magnitude = Math.max(0, Math.min(1, Math.abs(contribution) / maxContribution))
    const base = 0.15
    const redBlue = base * (1 - magnitude)
    const green = base + (1 - base) * magnitude
    return new THREE.Color(redBlue, green, redBlue)
  }
  
  // Fallback: color basado solo en el peso
  const intensity = Math.min(1, Math.abs(weight))
  if (weight > 0) {
    return new THREE.Color(0, intensity, 0) // Verde para pesos positivos
  }
  return new THREE.Color(intensity, 0, 0) // Rojo para pesos negativos
}

function getInputConnectionColor(sourceActivation) {
  const a = Math.max(0, Math.min(1, sourceActivation))
  const base = 0.12
  const redBlue = base * (1 - a)
  const green = base + (1 - base) * a
  return new THREE.Color(redBlue, green, redBlue)
}

function buildNetwork(scene, activations, weights, architecture, maxConnections, hideWeakConnections, connectionThickness, networkActivations = null) {
  const INPUT_ACTIVITY_THRESHOLD = 0.3
  const { layers: LAYERS, grids: LAYER_GRIDS } = calculateLayerGrids(architecture)
  // networkActivations se usa para calcular contribuciones (activation * weight) para colorear conexiones
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

  // NO muestrear el input layer - mostrar todas las 784 neuronas como el original
  const sampledActivations = activations

  // Helper: index -> (x, y, z) for a layer plane. Layers along X; each layer is a YZ plane.
  const neuronPosition = (layerIndex, neuronIndex) => {
    const [cols, rows] = LAYER_GRIDS[layerIndex]
    const isOutputLayer = layerIndex === LAYERS.length - 1
    const isInputLayer = layerIndex === 0
    
    // Calcular posición X (espaciado entre capas)
    const totalWidth = (LAYERS.length - 1) * VISUALIZER_CONFIG.layerSpacing
    const startX = -totalWidth / 2
    const x = startX + layerIndex * VISUALIZER_CONFIG.layerSpacing
    
    if (isInputLayer) {
      // Input layer: grid 28×28 con inputSpacing
      const row = Math.floor(neuronIndex / cols)
      const col = neuronIndex % cols
      const height = (rows - 1) * VISUALIZER_CONFIG.inputSpacing
      const width = (cols - 1) * VISUALIZER_CONFIG.inputSpacing
      const y = height / 2 - row * VISUALIZER_CONFIG.inputSpacing
      const z = -width / 2 + col * VISUALIZER_CONFIG.inputSpacing
      return new THREE.Vector3(x, y, z)
    } else if (isOutputLayer) {
      // Output layer: línea vertical
      const spacing = VISUALIZER_CONFIG.outputSpacing
      const height = (LAYERS[layerIndex] - 1) * spacing
      const y = height / 2 - neuronIndex * spacing
      return new THREE.Vector3(x, y, 0)
    } else {
      // Hidden layers: grid con hiddenSpacing
      const row = Math.floor(neuronIndex / cols)
      const col = neuronIndex % cols
      const height = (rows - 1) * VISUALIZER_CONFIG.hiddenSpacing
      const width = (cols - 1) * VISUALIZER_CONFIG.hiddenSpacing
      const y = height / 2 - row * VISUALIZER_CONFIG.hiddenSpacing
      const z = -width / 2 + col * VISUALIZER_CONFIG.hiddenSpacing
      return new THREE.Vector3(x, y, z)
    }
  }

  const w = weights || []
  for (let layerIndex = 0; layerIndex < LAYERS.length; layerIndex++) {
    const neuronCount = LAYERS[layerIndex]
    const layerActs = sampledActivations ? sampledActivations[layerIndex] : null
    const layerWeights = w[layerIndex]
    const nextCount = layerIndex < LAYERS.length - 1 ? LAYERS[layerIndex + 1] : 0
    const isInputLayer = layerIndex === 0
    const isOutputLayer = layerIndex === LAYERS.length - 1

    for (let i = 0; i < neuronCount; i++) {
      const pos = neuronPosition(layerIndex, i)
      const activation = layerActs ? layerActs[i] : 0
      const color = getActivationColor(activation, maxActivation, isInputLayer)
      
      // Geometría según tipo de capa
      let geo
      if (isInputLayer) {
        // Input layer: cubos pequeños
        geo = new THREE.BoxGeometry(
          VISUALIZER_CONFIG.inputNodeSize,
          VISUALIZER_CONFIG.inputNodeSize,
          VISUALIZER_CONFIG.inputNodeSize
        )
      } else {
        // Hidden/Output layers: esferas
        geo = new THREE.SphereGeometry(VISUALIZER_CONFIG.hiddenNodeRadius, 16, 16)
      }
      // Material según tipo de capa
      let mat
      if (isInputLayer) {
        // Input layer: MeshLambertMaterial con emissive bajo
        mat = new THREE.MeshLambertMaterial({
          color,
          emissive: new THREE.Color(0.08, 0.08, 0.08)
        })
      } else {
        // Hidden/Output layers: MeshBasicMaterial (sin iluminación) como el original
        mat = new THREE.MeshBasicMaterial({
          color,
          toneMapped: false
        })
      }
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.copy(pos)
      mesh.userData.isNetworkPart = true
      scene.add(mesh)

      if (layerWeights && nextCount > 0) {
        const connections = []
        // Todas las capas muestran todas sus neuronas, así que i es el índice real
        const realNeuronIndex = i
        
        for (let j = 0; j < nextCount; j++) {
          const weight = layerWeights[j][realNeuronIndex]
          connections.push({ sourceIndex: realNeuronIndex, targetIndex: j, weight })
        }
        connections.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
        const top = connections.slice(0, maxConnections)

        // Calcular contribuciones para colorear conexiones (como el original)
        const sourceActivations = networkActivations?.[layerIndex]
        let maxContribution = 0
        top.forEach((conn) => {
          const sourceActivation = sourceActivations?.[conn.sourceIndex] ?? 0
          const contribution = sourceActivation * conn.weight
          const absContribution = Math.abs(contribution)
          if (absContribution > maxContribution) maxContribution = absContribution
        })
        
        // Usar maxAbsWeight como fallback si no hay activaciones
        const maxAbsWeight = top.reduce((max, conn) => Math.max(max, Math.abs(conn.weight)), 0)
        const contributionScale = maxContribution > 1e-6 ? maxContribution : maxAbsWeight || 1

        for (const conn of top) {
          if (Math.abs(conn.weight) < hideWeakConnections) continue
          const sourceActivation = sourceActivations?.[conn.sourceIndex] ?? 0
          if (layerIndex === 0 && sourceActivation < INPUT_ACTIVITY_THRESHOLD) continue
          const from = pos.clone()
          const to = neuronPosition(layerIndex + 1, conn.targetIndex)
          const dir = new THREE.Vector3().subVectors(to, from)
          const length = dir.length()
          const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5)

          const baseRadius = VISUALIZER_CONFIG.connectionRadius * connectionThickness
          const activationScale = layerIndex === 0
            ? (0.05 + sourceActivation * 11.5)
            : 1
          const radius = baseRadius * activationScale
          const cylGeo = new THREE.CylinderGeometry(radius, radius, length, 10, 1, true)
          
          // Calcular contribución para colorear
          const contribution = sourceActivation * conn.weight
          const color = layerIndex === 0
            ? getInputConnectionColor(sourceActivation)
            : getWeightColor(conn.weight, contribution, contributionScale)
          
          const opacity = layerIndex === 0
            ? Math.min(1, 0.05 + sourceActivation * 1.8)
            : Math.min(1, 0.6 + Math.abs(conn.weight) * 0.4)
          const cylMat = new THREE.MeshLambertMaterial({
            color,
            transparent: true,
            opacity
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
  architecture,
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

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200)
    camera.position.set(-15, 0, 15)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 8
    controls.maxDistance = 52
    controls.target.set(0, 0, 0)
    controlsRef.current = controls

    // Iluminación según el original
    const ambient = new THREE.AmbientLight(0xffffff, 1.2)
    scene.add(ambient)
    const hemisphere = new THREE.HemisphereLight(0xffffff, 0x1a1d2e, 0.9)
    hemisphere.position.set(0, 20, 0)
    scene.add(hemisphere)
    const directional = new THREE.DirectionalLight(0xffffff, 1.4)
    directional.position.set(18, 26, 24)
    scene.add(directional)
    const fillLight = new THREE.DirectionalLight(0xa8c5ff, 0.8)
    fillLight.position.set(-20, 18, -18)
    scene.add(fillLight)
    const rimLight = new THREE.PointLight(0x88a4ff, 0.6, 60, 1.6)
    rimLight.position.set(0, 12, -24)
    scene.add(rimLight)

    const onResize = () => {
      if (!container || !camera || !renderer) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    buildNetwork(scene, activations, weights, architecture, maxConnections, hideWeakConnections, connectionThickness, activations)

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
    buildNetwork(scene, activations, weights, architecture, maxConnections, hideWeakConnections, connectionThickness, activations)
  }, [activations, weights, architecture, maxConnections, hideWeakConnections, connectionThickness])

  return null
}
