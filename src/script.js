import * as THREE from "three"
import "./style.css"
import vertexShader from "./shaders/vertex.glsl"
import fragmentShader from "./shaders/fragment.glsl"

//_ select canvas
const canvas = document.querySelector("canvas.webgl")

//*_ Create scene
const scene = new THREE.Scene()

//_ Dimensions
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//_ Geometries, materials and mesh
const plane = new THREE.PlaneGeometry(10, 10, 100, 100)

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uNoiseDistortion: { value: 2.0 },
    uSpeed: { value: 0.5 },
    uTime: { value: 0 },
    uBaseCol: { value: new THREE.Vector2(0, 0) },
  },
  transparent: true,
})

const mesh = new THREE.Mesh(plane, material)
scene.add(mesh)

//_ Camera
const camera = new THREE.PerspectiveCamera(
  75,
  size.width / size.height,
  0.001,
  1000
)

camera.position.set(0, 0, 10)
scene.add(camera)

//_ Renderer
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor("#151B26", 1)

//_ Interactions
const mouse = new THREE.Vector2()

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX / size.width
  mouse.y = event.clientY / size.height
})

window.addEventListener("touchmove", (event) => {
  mouse.x = event.touches[0].clientX / size.width
  mouse.y = event.touches[0].clientY / sizes.height
})

//_ Window events
window.addEventListener("resize", () => {
  size.height = window.innerHeight
  size.width = window.innerWidth

  //* Update camera
  camera.aspect = size.width / size.height
  camera.updateProjectionMatrix()

  //* Update renderer
  renderer.setSize(size.width, size.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//_ Frame
const clock = new THREE.Clock()

const frame = () => {
  renderer.render(scene, camera)

  const elapsedTime = clock.getElapsedTime()

  //* Update materials
  material.uniforms.uTime.value = elapsedTime
  material.uniforms.uBaseCol.value = mouse

  camera.lookAt(mesh.position)

  requestAnimationFrame(frame)
}

frame()
