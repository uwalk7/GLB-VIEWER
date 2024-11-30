import { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, useGLTF, SpotLight, Environment, Grid } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useControls, Leva } from 'leva'
import * as THREE from 'three'
import Sidebar from './Sidebar'

function Model({ url, position, scale }) {
  const { scene } = useGLTF(url)
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })
  return <primitive object={scene} position={position} scale={scale} />
}

function Ground({ visible }) {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.01, 0]} receiveShadow visible={visible}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#808080" />
    </mesh>
  )
}

function Scene({ url }) {
  const { 
    ambientLight, 
    spotlightIntensity,
    spotlightPosition,
    rotationSpeed,
    environmentIntensity,
    showGround,
    shadowMapSize,
    modelPosition,
    modelUnit
  } = useControls({
    modelUnit: {
      options: ['meters', 'centimeters'],
      value: 'meters',
      label: 'Model Units'
    },
    ambientLight: {
      value: 0.2,
      min: 0,
      max: 2,
      step: 0.1,
      label: 'Ambient Light'
    },
    spotlightIntensity: {
      value: 1.5,
      min: 0,
      max: 10,
      step: 0.1,
      label: 'Spotlight Intensity'
    },
    spotlightPosition: {
      value: [5, 8, 5],
      step: 0.5,
      label: 'Spotlight Position'
    },
    modelPosition: {
      value: [0, 0, 0],
      step: 0.1,
      label: 'Model Position'
    },
    rotationSpeed: {
      value: 0.5,
      min: 0,
      max: 5,
      step: 0.1,
      label: 'Rotation Speed'
    },
    environmentIntensity: {
      value: 0.2,
      min: 0,
      max: 2,
      step: 0.1,
      label: 'Environment Light'
    },
    showGround: {
      value: true,
      label: 'Show Ground'
    },
    shadowMapSize: {
      value: 2048,
      min: 512,
      max: 4096,
      step: 512,
      label: 'Shadow Quality'
    }
  })

  // Calculate scale based on units
  const modelScale = modelUnit === 'centimeters' ? 0.01 : 1

  return (
    <>
      <color attach="background" args={['#f0f0f0']} />
      
      {ambientLight > 0 && <ambientLight intensity={ambientLight} />}
      
      {spotlightIntensity > 0 && (
        <>
          <directionalLight
            position={spotlightPosition}
            intensity={spotlightIntensity}
            castShadow
            shadow-mapSize={[shadowMapSize, shadowMapSize]}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
            shadow-bias={-0.001}
          />
          <SpotLight
            position={spotlightPosition}
            intensity={spotlightIntensity * 0.5}
            angle={0.6}
            penumbra={0.5}
            castShadow
            shadow-mapSize={[shadowMapSize, shadowMapSize]}
            shadow-bias={-0.001}
          />
        </>
      )}
      
      <Model url={url} position={modelPosition} scale={modelScale} />
      <Ground visible={showGround} />
      
      <OrbitControls autoRotate autoRotateSpeed={rotationSpeed} />
      
      {environmentIntensity > 0 && (
        <Environment preset="city" intensity={environmentIntensity} />
      )}
      
      <EffectComposer>
        <Bloom luminanceThreshold={1} intensity={1.5} />
      </EffectComposer>
    </>
  )
}

export default function ModelViewer() {
  const [modelUrl, setModelUrl] = useState(null)
  const dropRef = useRef()

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.name.toLowerCase().endsWith('.glb')) {
      const url = URL.createObjectURL(file)
      setModelUrl(url)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleClear = () => {
    if (modelUrl) {
      URL.revokeObjectURL(modelUrl)
      setModelUrl(null)
    }
  }

  return (
    <div className="viewer-container">
      <Leva collapsed={false} />
      <Sidebar onClear={handleClear} />
      <div className="main-content">
        {!modelUrl ? (
          <div
            ref={dropRef}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="drop-zone"
          >
            <div className="drop-text">
              <h2>Drop GLB File Here</h2>
              <p>or click to select file</p>
            </div>
          </div>
        ) : (
          <div className="canvas-container">
            <Canvas 
              shadows={{ type: THREE.PCFSoftShadowMap }} 
              camera={{ position: [0, 2, 10], fov: 50 }}
            >
              <Scene url={modelUrl} />
            </Canvas>
          </div>
        )}
      </div>
    </div>
  )
}
