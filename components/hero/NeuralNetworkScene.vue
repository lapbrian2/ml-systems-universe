<script setup lang="ts">
/**
 * NeuralNetworkScene.vue
 *
 * Inner scene component rendered within <TresCanvas>.
 * Uses TresJS useLoop() for frame-synced animation of ~70 neural-network nodes
 * connected by translucent lines, with gentle auto-rotation and floating motion.
 */
import { ref, shallowRef, onBeforeUnmount } from 'vue'
import { useLoop } from '@tresjs/core'
import {
  BufferGeometry,
  Float32BufferAttribute,
  LineBasicMaterial,
  MeshBasicMaterial,
  SphereGeometry,
  Color,
  Group,
  Mesh,
  LineSegments,
} from 'three'

const props = defineProps<{
  mouseX: number
  mouseY: number
}>()

// ── Color palette ──
const PALETTE = ['#14b8a6', '#a855f7', '#22c55e', '#f0a500']

// ── Node data ──
interface NodeDef {
  baseX: number
  baseY: number
  baseZ: number
  color: string
  size: number
  phase: number
  speed: number
  amp: number
}

const LAYER_COUNT = 5
const LAYER_SPACING = 3.5
const NODES_PER_LAYER = [12, 16, 14, 16, 12] // ~70 total

function createNodeDefs(): NodeDef[] {
  const defs: NodeDef[] = []
  for (let layer = 0; layer < LAYER_COUNT; layer++) {
    const count = NODES_PER_LAYER[layer]
    const xBase = (layer - (LAYER_COUNT - 1) / 2) * LAYER_SPACING
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + layer * 0.3
      const ry = 2.2 + Math.sin(i * 1.7) * 1.5
      const rz = 1.8 + Math.cos(i * 2.3) * 1.2
      defs.push({
        baseX: xBase + (Math.random() - 0.5) * 1.2,
        baseY: Math.cos(angle) * ry + (Math.random() - 0.5) * 0.8,
        baseZ: Math.sin(angle) * rz + (Math.random() - 0.5) * 0.6,
        color: PALETTE[(layer + i) % PALETTE.length],
        size: 0.06 + Math.random() * 0.06,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.4,
        amp: 0.15 + Math.random() * 0.2,
      })
    }
  }
  return defs
}

const nodeDefs = createNodeDefs()

// ── Connection index ──
interface ConnDef {
  from: number
  to: number
  r: number
  g: number
  b: number
}

const MAX_DIST = 4.5

function createConnDefs(): ConnDef[] {
  const out: ConnDef[] = []
  for (let i = 0; i < nodeDefs.length; i++) {
    for (let j = i + 1; j < nodeDefs.length; j++) {
      const a = nodeDefs[i]
      const b = nodeDefs[j]
      const dx = a.baseX - b.baseX
      const dy = a.baseY - b.baseY
      const dz = a.baseZ - b.baseZ
      if (dx * dx + dy * dy + dz * dz < MAX_DIST * MAX_DIST) {
        const c1 = new Color(a.color)
        const c2 = new Color(b.color)
        c1.lerp(c2, 0.5)
        out.push({ from: i, to: j, r: c1.r, g: c1.g, b: c1.b })
      }
    }
  }
  return out
}

const connDefs = createConnDefs()

// ── Build Three.js objects imperatively ──
// Sphere geometry shared by all nodes (low-poly for performance)
const sphereGeo = new SphereGeometry(1, 8, 6)

// Group that holds everything and auto-rotates
const sceneGroup = shallowRef(new Group())

// Node meshes
const meshes: Mesh[] = []
for (const nd of nodeDefs) {
  const mat = new MeshBasicMaterial({
    color: new Color(nd.color),
    transparent: true,
    opacity: 0.55,
  })
  const mesh = new Mesh(sphereGeo, mat)
  mesh.position.set(nd.baseX, nd.baseY, nd.baseZ)
  mesh.scale.setScalar(nd.size)
  sceneGroup.value.add(mesh)
  meshes.push(mesh)
}

// Connection lines as a single LineSegments object
const linePositions = new Float32Array(connDefs.length * 6)
const lineColors = new Float32Array(connDefs.length * 6)

for (let i = 0; i < connDefs.length; i++) {
  const c = connDefs[i]
  const a = nodeDefs[c.from]
  const b = nodeDefs[c.to]
  const o = i * 6
  linePositions[o] = a.baseX
  linePositions[o + 1] = a.baseY
  linePositions[o + 2] = a.baseZ
  linePositions[o + 3] = b.baseX
  linePositions[o + 4] = b.baseY
  linePositions[o + 5] = b.baseZ

  lineColors[o] = c.r
  lineColors[o + 1] = c.g
  lineColors[o + 2] = c.b
  lineColors[o + 3] = c.r
  lineColors[o + 4] = c.g
  lineColors[o + 5] = c.b
}

const lineGeo = new BufferGeometry()
lineGeo.setAttribute('position', new Float32BufferAttribute(linePositions, 3))
lineGeo.setAttribute('color', new Float32BufferAttribute(lineColors, 3))

const lineMat = new LineBasicMaterial({
  transparent: true,
  opacity: 0.08,
  vertexColors: true,
})

const lineSegments = new LineSegments(lineGeo, lineMat)
sceneGroup.value.add(lineSegments)

// ── Camera position ref (updated by parallax) ──
const cameraPos = ref<[number, number, number]>([0, 0, 14])

// ── Live node positions (flat Float32Array: x,y,z per node) ──
const livePos = new Float32Array(nodeDefs.length * 3)

// ── Animation via TresJS useLoop ──
const { onBeforeRender } = useLoop()

onBeforeRender(({ elapsed }) => {
  // Auto-rotate scene group
  sceneGroup.value.rotation.y = elapsed * 0.1

  // Update camera parallax
  cameraPos.value = [props.mouseX * 0.6, props.mouseY * -0.4, 14]

  // Float nodes with sine-wave displacement
  for (let i = 0; i < nodeDefs.length; i++) {
    const nd = nodeDefs[i]
    const t = elapsed * nd.speed + nd.phase
    const px = nd.baseX + Math.sin(t) * nd.amp * 0.5
    const py = nd.baseY + Math.sin(t * 1.3 + 1.0) * nd.amp
    const pz = nd.baseZ + Math.cos(t * 0.7 + 2.0) * nd.amp * 0.3

    meshes[i].position.set(px, py, pz)

    const off = i * 3
    livePos[off] = px
    livePos[off + 1] = py
    livePos[off + 2] = pz
  }

  // Update line segment positions to follow nodes
  const posAttr = lineGeo.getAttribute('position') as Float32BufferAttribute
  const buf = posAttr.array as Float32Array

  for (let i = 0; i < connDefs.length; i++) {
    const c = connDefs[i]
    const aOff = c.from * 3
    const bOff = c.to * 3
    const o = i * 6
    buf[o] = livePos[aOff]
    buf[o + 1] = livePos[aOff + 1]
    buf[o + 2] = livePos[aOff + 2]
    buf[o + 3] = livePos[bOff]
    buf[o + 4] = livePos[bOff + 1]
    buf[o + 5] = livePos[bOff + 2]
  }
  posAttr.needsUpdate = true
})

// ── Cleanup ──
onBeforeUnmount(() => {
  sphereGeo.dispose()
  lineGeo.dispose()
  lineMat.dispose()
  for (const m of meshes) {
    ;(m.material as MeshBasicMaterial).dispose()
  }
})
</script>

<template>
  <!-- Camera: position driven by mouse parallax -->
  <TresPerspectiveCamera
    :position="cameraPos"
    :fov="50"
    :near="0.1"
    :far="100"
  />

  <!-- The scene group is added as a primitive so we control it imperatively -->
  <primitive :object="sceneGroup" />

  <!-- Ambient light for MeshBasicMaterial visibility -->
  <TresAmbientLight :intensity="1" />
</template>
