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
const sphere = new THREE.SphereBufferGeometry(4, 64, 64)

//_ Create Material
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uElevation: { value: 1 },
    uFrequency: { value: new THREE.Vector2(4, 1.5) },
    uSpeed: { value: 0.75 },
    uTime: { value: 0 },
    uDepthColor: { value: new THREE.Color("#186681") },
    uSurfacerColor: { value: new THREE.Color("#9bd8ff") },
    uColorOffset: { value: 1 },
    uColorMultiplier: { value: 1.2 },
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
  .add(material.uniforms.uElevation, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uElevation")

gui
  .add(material.uniforms.uFrequency.value, "x")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uFrequencyX")

gui
  .add(material.uniforms.uFrequency.value, "y")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uFrequencyY")

gui
  .add(material.uniforms.uSpeed, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("uSpeed")

gui
  .add(material.uniforms.uColorOffset, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("uColorOffset")

gui
  .add(material.uniforms.uColorMultiplier, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("uColorMultiplier")

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
