import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as lil from 'lil-gui'

// Canvas
const canvas = document.querySelector('canvas.hemel')

// Cursor
const cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', event);

function event() {
    cursor.x = event.clientX / window.innerWidth - 0.5;
    cursor.y = -(event.clientY / window.innerHeight - 0.5);

    console.log(cursor.x, cursor.y);
};

//resize code gehaald van https://stackoverflow.com/questions/20290402/three-js-resizing-canvas
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

//scene
const scene = new THREE.Scene();

//code from https://stackoverflow.com/questions/19865537/three-js-set-background-image
const loader = new THREE.TextureLoader();
loader.load('./hemel.jpg', function(texture) {
    scene.background = texture;
});

//camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;
scene.add(camera);

//controles
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//group
const group = new THREE.Group();
scene.add(group);

//texture 
const loadingManager = new THREE.LoadingManager
loadingManager.onStart = function onStart() {
    console.log('loading started')
}
loadingManager.onLoad = function onLoad() {
    console.log('loading finished')
}
loadingManager.onProgress = function onProgress() {
    console.log('loading progressing')
}
loadingManager.onError = function onError() {
    console.log('loading error')
}
const textureLoader = new THREE.TextureLoader(loadingManager)
const moonTexture = textureLoader.load('./moon.jpg');
const earthTexture = textureLoader.load('./earth.jpg');


//objects
const earthGeometry = new THREE.SphereGeometry(3, 32, 16);
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

const moonGeometry = new THREE.SphereGeometry(1, 32, 16);
const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);
moon.position.x = 15;
group.add(moon);

//Debug UI
const gui = new lil.GUI({ width: 500 });
gui.close();
gui.add(controls, 'enable')
    //earth debug 
const earthFolder = gui.addFolder('Earth');
earthFolder.close();

earthFolder
    .add(earth.position, 'x')
    .min(-9)
    .max(9)
    .step(0.01)
    .name('earth position x');

earthFolder.add(earth.position, 'y')
    .min(-9)
    .max(9)
    .step(0.01)
    .name('earth position y ');

earthFolder
    .add(earth.position, 'z')
    .min(-20)
    .max(40)
    .step(0.01)
    .name('earth position z');

earthFolder
    .add(earth, 'visible')
    .name('earth visibilty');


earthFolder
    .add(earthMaterial, 'wireframe')
    .name('earth material');

//moon debug
const moonFolder = gui.addFolder('Moon');
moonFolder.close();

moonFolder
    .add(moon.position, 'x')
    .min(-9)
    .max(9)
    .step(0.01)
    .name('moon position x');

moonFolder
    .add(moon.position, 'y')
    .min(-9)
    .max(9)
    .step(0.01)
    .name('moon position y');

moonFolder
    .add(moon.position, 'z')
    .min(-20)
    .max(40)
    .step(0.01)
    .name('moon position z');

moonFolder
    .add(moon, 'visible')
    .name('moon visibilty');

moonFolder
    .add(moonMaterial, 'wireframe')
    .name('moon material');

//camera debug
const cameraFolder = gui.addFolder('Camera');
cameraFolder.close();

cameraFolder
    .add(camera.position, 'x')
    .min(-9)
    .max(9)
    .step(0.01)
    .name('camera position x');

cameraFolder
    .add(camera.position, 'y')
    .min(-9)
    .max(9)
    .step(0.01)
    .name('camera position y');

cameraFolder
    .add(camera.position, 'z')
    .min(0)
    .max(100)
    .step(0.01)
    .name('camera position z');

cameraFolder
    .add(camera.rotation, 'z')
    .min(0)
    .max(10)
    .step(0.01)
    .name('camera rotation z');


//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(window.innerWidth, window.innerHeight);
// ik heb de pixel ratio gezet tussen 1-2 voor voorkomen van performance problemen
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock();

function animate() {
    window.requestAnimationFrame(animate);

    // de code hieronder niet gebruiken, omdat dit te maken heeft met fps(frame per second). 
    // de objecten van dit website gaan sneller draaien als de Computer een hoge fps heeft en draaien trager als de computer een lage fps heeft.

    /* earth.rotation.y -= 0.001;
     moon.rotation.z += 0.01;
     group.rotation.y += 0.005;*/

    //Om te voorkomen dat de website niet te traag of niet te snel reageerd, stellen we onze waarde gelijk aan de tijd m.b.v THREE.Clock()


    const elapsedTime = clock.getElapsedTime();

    earth.rotation.y = -elapsedTime / Math.PI;
    moon.rotation.x = elapsedTime / Math.PI;
    group.rotation.y = elapsedTime / Math.PI;

    //camera updates
    // sin(x) + cos (x) = 1 (dus 1 hele cirkel) 
    //Math.PI *2 = 360 grade. 
    //* 50 is voor de afstand tussen de camera en de object
    /*camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 50
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 50
    camera.position.y = cursor.y * 50
    camera.lookAt(earth.position)*/

    //Update controls
    controls.update();



    /*camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
    camera.position.y = cursor.y * 3
    camera.lookAt(earth.position)*/


    renderer.render(scene, camera);
};
animate();