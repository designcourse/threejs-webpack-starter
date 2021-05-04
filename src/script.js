import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { PointLight } from 'three'
// loading 
const textureLoader = new THREE.TextureLoader()
const normalTexture = textureLoader.load('/textures/ballTexture.png')

// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
//const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const geometry = new THREE.SphereBufferGeometry(.5, 64, 64)

// Materials

const material = new THREE.MeshStandardMaterial()
material.color = new THREE.Color(0x0)
material.wireframe = false
material.roughness = .3
material.metalness = .7
material.normalMap = normalTexture;

// Mesh
const sphere = new THREE.Mesh(geometry,material)
scene.add(sphere)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.set(-2.39, 3, 4)
pointLight.intensity = 1
scene.add(pointLight)

//Light 1
const pointLight1 = new THREE.PointLight(0xff0000, 10)
pointLight1.position.set(-6, 11.18, 1)
//pointLight1.intensity = 3
scene.add(pointLight1)
//
//Light 1 GUI Folder
// const light1 = gui.addFolder('Light 1')

// light1.add(pointLight1.position, 'y').min(-3).max(150).step(0.01)
// light1.add(pointLight1.position, 'x').min(-6).max(100).step(0.01)
// light1.add(pointLight1.position, 'z').min(-3).max(100).step(0.01)
// light1.add(pointLight1, 'intensity').min(0).max(20).step(0.01)

//Light 2
const pointLight2 = new THREE.PointLight(0xef00ff, 2)
pointLight2.position.set(2.66, -3, 1)
pointLight2.intensity = 2
scene.add(pointLight2)

//Light 2 GUI Folder
//const light2 = gui.addFolder('Light 2')

// light2.add(pointLight2.position, 'y').min(-3).max(100).step(0.01)
// light2.add(pointLight2.position, 'x').min(-6).max(100).step(0.01)
// light2.add(pointLight2.position, 'z').min(-3).max(100).step(0.01)
// light2.add(pointLight2, 'intensity').min(0).max(20).step(0.01)

// const light2color = {
//     color: 0xff0000,
// }

// light2.addColor(light2color, 'color')
// .onChange(()=>{
//     pointLight2.color.set(light2color.color)
// })

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

document.addEventListener('mousemove', onDocMouseMove)

let mouseX = 0
let mouseY = 0

let targetX = 0
let targetY = 0

const windowX = window.innerWidth / 2
const windowY = window.innerHeight / 2

function onDocMouseMove (e)  {
    mouseX = (e.clientX - windowX)
    mouseY = (e.clientY - windowY)
    console.log(mouseX)
    console.log(e.clientX)
}
const updateSphere = (e) =>{
    sphere.position.y = window.scrollY * .002
}
window.addEventListener('scroll', updateSphere)

const clock = new THREE.Clock()

const tick = () =>
{
    targetX = mouseX * .001
    targetY = mouseY * .001

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime

    sphere.rotation.y += .5 * (targetX - sphere.rotation.y)
    sphere.rotation.x += .05 * (targetY - sphere.rotation.x)
    sphere.position.z += -.1 * (targetY - sphere.rotation.x)

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()