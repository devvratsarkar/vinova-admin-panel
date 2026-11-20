import React, { Suspense, Component } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Stage } from '@react-three/drei'

/**
 * Fixes doubled base-URL that occurs when the backend re-saves an already-absolute
 * URL (e.g. "https://host/https://host/path/file.glb" → "https://host/path/file.glb").
 */
function normalizeGlbUrl(src) {
  if (!src) return src
  const doubled = src.match(/^(https?:\/\/[^/]+)\/(https?:\/\/.+)$/)
  if (doubled) return doubled[2]
  return src
}

class GlbErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="d-flex align-items-center justify-content-center h-100 text-muted"
          style={{ fontSize: '0.82rem' }}
        >
          <span>Could not load 3D preview</span>
        </div>
      )
    }
    return this.props.children
  }
}

function Model({ url }) {
  const { scene } = useGLTF(url)
  return (
    <Stage preset="rembrandt" intensity={1} environment="city" adjustCamera>
      <primitive object={scene} />
    </Stage>
  )
}

function Spinner() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ position: 'absolute', inset: 0 }}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading 3D model…</span>
      </div>
    </div>
  )
}

/**
 * Renders a .glb / .gltf file as an interactive 3D scene using Three.js.
 *
 * Props:
 *   src      {string}  – blob URL or server URL of the .glb / .gltf file
 *   fileName {string}  – readable filename (pass file.name when src is a blob URL)
 */
export default function GlbPreview({ src, fileName }) {
  if (!src) return null

  const resolvedSrc = normalizeGlbUrl(src)
  const displayName = fileName || src.split('/').pop() || 'model.glb'

  return (
    <div className="mt-2 border">
      <div style={{ position: 'relative', height: '120px' }}>
        <GlbErrorBoundary>
          <Suspense fallback={<Spinner />}>
            <Canvas style={{ height: '100%' }}>
              <Suspense fallback={null}>
                <Model url={resolvedSrc} />
              </Suspense>
              <OrbitControls makeDefault enablePan={false} />
            </Canvas>
          </Suspense>
        </GlbErrorBoundary>
      </div>

      <div
        className="d-flex align-items-center gap-2 px-2 py-1 border-top"
        style={{ background: '#f8f9fa', fontSize: '0.82rem' }}
      >
        <i className="fe fe-box text-primary" style={{ fontSize: '1.1rem', flexShrink: 0 }} />
        <span className="text-muted text-truncate" title={displayName}>
          {displayName}
        </span>
      </div>
    </div>
  )
}
