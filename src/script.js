import './style.css'
// import './css/main.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Material } from 'three'
import { gsap } from 'gsap'
import { Scrolltrigger } from 'gsap/ScrollTrigger'

// texture Loader
const loader = new THREE.TextureLoader()
const cross = loader.load('plus-8.png')
// const moon = loader.load('moon.jpg')
// const normalMoon = loader.load('normal.jpg')


// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const geometry = new THREE.SphereGeometry(10, 50, 50)

const particlesGeometry = new THREE.BufferGeometry;

const particlesCount = 40000;

const positionArray = new Float32Array(particlesCount * 4);

for (let i = 0; i < particlesCount * 4; i++) {
    positionArray[i] = (Math.random() - 0.3) * (Math.random() * 1000);
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 4))

// Materials
// const material = new THREE.PointsMaterial({
//     size: 0.005
// })

const material = new THREE.MeshNormalMaterial()
// const moonMaterial = new THREE.MeshStandardMaterial({
//     map: moon,
//     normal: normalMoon,
// })
material.wireframe = true
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.07,
    map: cross,
    transparent: true,
    blending: THREE.AdditiveBlending
})

// Mesh
const sphere = new THREE.Mesh(geometry,material)
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
//scene.add(sphere, particlesMesh)
scene.add(sphere, particlesMesh)


// Lights
const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 500)
camera.position.x = 20
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = false
controls.enablePan = false
controls.dampingFactor = 0.05
controls.maxDistance = 1000
controls.minDistance = 30

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#11182f'))

// Mouse
document.addEventListener('mousemove', animateParticles)

let mouseX = 0
let mouseY = 0

function animateParticles(event) {
    mouseY = event.clientY
    mouseX = event.clientX
}

function onMouseMove(e) {
    const x = e.clientX
    const y = e.clientY

    gsap.to(scene.rotation, {
        y: gsap.utils.mapRange(0, window.innerWidth, 1, -1, x),
        x: gsap.utils.mapRange(0, window.innerHeight, 1, -1, y),
    })
}

window.addEventListener('mousemove', onMouseMove)
/**
 * Animation GSAP
 */
gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.defaults({
    scrub: 6,
    ease: 'none',
})

const sections = document.querySelectorAll('.section')
const first = document.querySelector('.first')
gsap.from(sphere.position, {
    y: 1,
    duration: 1,
    ease: 'expo',
})
gsap.from('h1', {
    yPercent: 100,
    autoAlpha: 0,
    ease: 'back',
    delay: 0.3,
})
gsap.to(sphere.rotation, {
    x: Math.PI * 2,
    scrollTrigger: {
        trigger: sections[1],
    },
})
gsap.to(sphere.scale, {
    x: 2,
    y: 2,
    z: 2,
    scrollTrigger: {
        trigger: sections[2],
    },    
})
gsap.to(particlesMesh.scale, {
    x: 2,
    y: 2,
    z: 2,
    duration: 5,
    scrollTrigger: {
        trigger: sections[3],
    },    
})
gsap.to(sphere.scale, {
    x: 1,
    y: 1,
    z: 1,
    scrollTrigger: {
        trigger: sections[4],
    },
},)
gsap.to(sphere.rotate, {
    y: Math.PI * 2,
    scrollTrigger: {
        trigger: sections[5],
    },
},)


/**
 * Animate
 */

const clock = new THREE.Clock()

const moveCamera = () => {

    const t = document.body.getBoundingClientRect().top;
    sphere.rotation.x += 0.05;
    sphere.rotation.y += 0.075;
    sphere.rotation.z += 0.05;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;

}

//document.body.onscroll = moveCamera;
moveCamera();



const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime
    particlesMesh.rotation.y = -.1 * elapsedTime

    if(mouseX > 0) {
        particlesMesh.rotation.x = - mouseY * (0.00008 * elapsedTime)
        particlesMesh.rotation.y =  mouseX * (0.00008 * elapsedTime)
    }

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}


tick()
//-------------------------------------------------
/**
 * Button click
 */
 $(function() {
    $('a[href*=#]').on('click', function(e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
    });
  });