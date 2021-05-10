import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"

//_ Import shaders
import vertexShader from "./shaders/vertex.glsl"
import fragmentShader from "./shaders/fragment.glsl"

//_ Debug
const gui = new dat.GUI()

//_ Select the canvas
const canvas = document.querySelector("canvas.webgl")

//_ Set dimensions
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//_ Create a scene
const scene = new THREE.Scene()

//_ Create Geometry
const sphere = new THREE.IcosahedronBufferGeometry(5, 48)

//_ Create Material
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uNoiseDensity: { value: 1.5 },
    uNoiseStrength: { value: 1 },
    uRotationFrequency: { value: 3 },
    uRotationAmplitude: { value: 6 },
    uSpeed: { value: 0.2 },
    uTime: { value: 0 },
  },
})

//_ Create mesh
const mesh = new THREE.Mesh(sphere, material)
scene.add(mesh)

mesh.rotation.z = Math.PI * 2

//_ Create camera
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.01,
  1000
)
camera.position.set(2, 2, 2)
scene.add(camera)

//_ Create renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})

renderer.setSize(size.width, size.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor("#151B26", 1)

//_ Resize events
window.addEventListener("resize", () => {
  //* Update sizes
  size.width = window.innerWidth
  size.height = window.innerHeight

  //* Update camera
  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()

  //* Update renderer
  renderer.setSize(size.width, size.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

gui
  .add(material.uniforms.uNoiseDensity, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uNoiseDensity")

gui
  .add(material.uniforms.uNoiseStrength, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uNoiseStrength")

gui
  .add(material.uniforms.uRotationFrequency, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uRotationFrequency")

gui
  .add(material.uniforms.uRotationAmplitude, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uRotationAmplitude")

gui
  .add(material.uniforms.uSpeed, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("uSpeed")

//_ Add controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//_ Frame function
const clock = new THREE.Clock()

const frame = () => {
  const elpasedTime = clock.getElapsedTime()

  //* Update uTime
  material.uniforms.uTime.value = elpasedTime

  controls.update()

  renderer.render(scene, camera)

  window.requestAnimationFrame(frame)
}

frame()
