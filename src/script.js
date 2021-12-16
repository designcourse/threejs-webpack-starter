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

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const touch = new THREE.Vector2();
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
let lights = [];

// Objects
// const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );
const globeGeometry = new THREE.SphereGeometry(10, 60, 60)

const particlesGeometry = new THREE.BufferGeometry;

const sunGeometry = new THREE.SphereGeometry(50, 60, 60)

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



const globeMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load('earthMap8k.jpeg'),
    bumpMap: new THREE.ImageUtils.loadTexture('8081_earthbump10k.jpg'),
    bumpScale: 0.005,
    // new THREE.TextureLoader().load('8081_earthbump10k.jpg'),
    specularMap: new THREE.TextureLoader().load('8081_earthspec10k'),
    
    specular: new THREE.Color('grey')
})
// const moonMaterial = new THREE.MeshStandardMaterial({
//     map: moon,
//     normal: normalMoon,
// })
// material.wireframe = true
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.07,
    map: cross,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
})

const sunMaterial = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load('sunmap.jpg')
    
})

// Mesh
const sphere = new THREE.Mesh(globeGeometry,globeMaterial)
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
const sun = new THREE.Mesh(sunGeometry,sunMaterial)
//scene.add(sphere, particlesMesh)

function createLights(scene){
    lights[0] = new THREE.PointLight("#004d99", .5, 0);
    lights[1] = new THREE.PointLight("#004d99", .5, 0);
    lights[2] = new THREE.PointLight("#004d99", .7, 0);
    lights[3] = new THREE.AmbientLight("#ffffff");

    lights[0].position.set(200, 0, -400);
    lights[1].position.set(200, 200, 400);
    lights[2].position.set(-200, -200, -50);

    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);
    scene.add(lights[3]);
}

createLights(scene);


//====================

let earthCloudGeo = new THREE.SphereGeometry(6, 50, 50);
let atmosphereGeo = new THREE.SphereGeometry(6, 50, 50);
// Add cloud texture
let earthCloudsTexture = new THREE.TextureLoader().load('earthhiresclouds4K.jpg');

// Add cloud material
let earthMaterialClouds = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: earthCloudsTexture,
    transparent:true,
    opacity: 0.4
});

let athmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x9fb9e2,
    transparent:true,
    opacity: 0.7
});

// Create final texture for clouds
let earthClouds = new THREE.Mesh(earthCloudGeo, earthMaterialClouds);
let atmosphere = new THREE.Mesh(atmosphereGeo, athmosphereMaterial)
// Scale above the earth sphere mesh
earthClouds.scale.set( 1.68, 1.68, 1.68);
atmosphere.scale.set( 1.60, 1.65, 1.60);
sun.scale.set(5, 5, 5)

// Make child of the earth
sphere.add( earthClouds, atmosphere) 
sun.position.set(20,20,20)
scene.add(sphere, particlesMesh, sun)
//====================

//======================


let moonGeometry = new THREE.SphereGeometry(1.64, 60, 60);
let moonMap = new THREE.TextureLoader().load('moon.jpg');
let moonBump = new THREE.TextureLoader().load('moonbump4k.jpg');
let moonMaterial = new THREE.MeshPhongMaterial({
    map: moonMap,
    bumpMap: moonBump,
    bumpScale: 1,
});

let moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(10, 10, 10);

sphere.add(moon);




//======================

// Lights
// const pointLight = new THREE.PointLight(0xffffff, 0.1)

// pointLight.position.z = 5
// scene.add(pointLight)

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
camera.position.x = 5
// camera.position.z = 5
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
renderer.setClearColor(new THREE.Color('#000000'))

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

function onWindowClick(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    let intersects = raycaster.intersectObjects(earthClouds.children);

    for (let i = 0; i < intersects.length; i++){
        document.querySelector("#region").innerText = "Region: " + intersects[0].object.userData.region;
        document.getElementById("region").style.color = intersects[0].object.userData.color;
        document.querySelector("#country-info").innerText = "Country: " + intersects[0].object.userData.country;
        document.querySelector("#language").innerText = "Language: " + intersects[0].object.userData.language;
        document.querySelector("#population").innerText = "Population: " + intersects[0].object.userData.population;
        document.querySelector("#area-sq-mi").innerText = "Area(mile^2): " + intersects[0].object.userData.area_sq_mi;
        document.querySelector("#gdp-per-capita").innerText = "GDP Per-Capita: " + intersects[0].object.userData.gdp_per_capita;
        document.querySelector("#climate").innerText = "Climate: " + intersects[0].object.userData.climate;
    }
    const item = intersects[0];
    let point = item.point;
    let camDistance = camera.position.copy(point).normalize.multiplyScalar(camDistance);
};


window.addEventListener('mousemove', onMouseMove)
window.addEventListener('click', onWindowClick, false);
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
    x: 0,
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
    sphere.rotation.x += 0.015;
    sphere.rotation.y += 0.015;
    sphere.rotation.z += 0.015;

    moon.rotation.x += 0.1;
    moon.rotation.y += 0.15;
    moon.rotation.z += 0.1;

    // camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    // camera.rotation.y = t * -0.0002;

}

//document.body.onscroll = moveCamera;
moveCamera();



const tick = () =>
{

    const elapsedTime = (clock.getElapsedTime() - clock.getElapsedTime()*0.5)*0.1

    // Update objects
    sphere.rotation.y = .05 * elapsedTime
    moon.rotation.y = .15 * elapsedTime
    earthClouds.rotation.y = .08 * elapsedTime
    particlesMesh.rotation.y = .1 * elapsedTime

    if(mouseX > 0) {
        particlesMesh.rotation.x = - mouseY * (0.00008 * elapsedTime)
        particlesMesh.rotation.y =  mouseX * (0.00008 * elapsedTime)
        sphere.rotation.x = - mouseY * (0.00008 * elapsedTime)
        sphere.rotation.y =  mouseX * (0.00008 * elapsedTime)
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