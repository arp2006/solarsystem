import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { degToRad } from 'three/src/math/MathUtils.js';

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath('\\static\\cubemap\\')

const sph = new THREE.SphereGeometry(1,32,32);
const ringGeometry = new THREE.RingGeometry(26,35,32)

const sunTex = textureLoader.load('\\static\\textures\\sun.jpg');
const earthnigTex = textureLoader.load('\\static\\textures\\earthnight.jpg');
const marsTex = textureLoader.load('\\static\\textures\\mar.jpg');
const venTex = textureLoader.load('\\static\\textures\\venus.jpg');
const jupTex = textureLoader.load('\\static\\textures\\jup.jpg');
const uranTex = textureLoader.load('\\static\\textures\\uran.jpg');
const nepTex = textureLoader.load('\\static\\textures\\nep.jpg');
const mercTex = textureLoader.load('\\static\\textures\\merc.jpg');
const satTex = textureLoader.load('\\static\\textures\\sat.jpg');
const moonTex = textureLoader.load('\\static\\textures\\moon.jpg');
const satringTex = textureLoader.load('\\static\\textures\\saturn_ring.png');
const uranringTex = textureLoader.load('\\static\\textures\\uranus_ring.png');

const sunMat = new THREE.MeshBasicMaterial({ map: sunTex });
const earthMat = new THREE.MeshStandardMaterial({ map: earthnigTex });
const mercMat = new THREE.MeshStandardMaterial({ map: mercTex });
const venMat = new THREE.MeshStandardMaterial({ map: venTex });
const marsMat = new THREE.MeshStandardMaterial({ map: marsTex });
const jupMat = new THREE.MeshStandardMaterial({ map: jupTex });
const satMat = new THREE.MeshStandardMaterial({ map: satTex });
const uranusMat = new THREE.MeshStandardMaterial({ map: uranTex });
const neptuneMat = new THREE.MeshStandardMaterial({ map: nepTex });
const moonMat = new THREE.MeshBasicMaterial({ map: moonTex });
const satRingmat = new THREE.MeshBasicMaterial({ map: satringTex, side: THREE.DoubleSide});
const uranRingmat = new THREE.MeshBasicMaterial({ map: uranringTex, side: THREE.DoubleSide});
const orbitMat = new THREE.MeshBasicMaterial({color: 'white',side: THREE.DoubleSide})

const bgmap = cubeTextureLoader.load([
  'right.png',
  'left.png',
  'top.png',
  'bottom.png',
  'front.png',
  'back.png'
]);
scene.background = bgmap;

const def = 142.6;
const sun = new THREE.Mesh(sph,sunMat);
sun.scale.setScalar(def);
scene.add(sun);
const planets = [
  {
    name: 'mercury',
    scale: 1,
    posn: def + 39,
    speed: 0.00017,
    material: mercMat,
    moons: []
  },
  {
    name: 'venus',
    scale: 2.48,
    posn: def + 72,
    speed: -0.00004,
    material: venMat,
    moons: []
  },
  {
    name: 'earth',
    scale: 2.61,
    posn: def + 100,
    speed: 0.01,
    material: earthMat,
    moons: [
      {
        name: 'moon',
        scale: 0.65,
        distance: 8,
        speed: 0.00257,
      }
    ]
  },
  {
    name: 'mars',
    scale: 1.39,
    posn: def + 152,
    speed: 0.00971,
    material: marsMat,
    moons: []
  },
  {
    name: 'jupiter',
    scale: 28.65,
    posn: def + 520,
    speed: 0.02439,
    material: jupMat,
    moons: []
  },
  {
    name: 'saturn',
    scale: 23.86,
    posn: def + 954,
    speed: 0.02222,
    material: satMat,
    moons: []
  },
  {
    name: 'uranus',
    scale: 10.39,
    posn: def + 1920,
    speed: -0.01388,
    material: uranusMat,
    moons: []
  },
  {
    name: 'neptune',
    scale: 10.09,
    posn: def + 3006,
    speed: 0.01493,
    material: neptuneMat,
    moons: []
  }
];

const planetArr = planets.map((planet) => {
  const planetMesh = new THREE.Mesh(sph, planet.material); 
  planetMesh.scale.setScalar(planet.scale);
  planetMesh.position.x = planet.posn; 
  scene.add(planetMesh);

  const orbitGeo = new THREE.TorusGeometry(planet.posn,0.1,8,100);
  const orbitMesh = new THREE.Mesh(orbitGeo, orbitMat);
  orbitMesh.rotation.x = Math.PI / 2;
  scene.add(orbitMesh);
  
  planetMesh.userData.moons = [];
  planet.moons.forEach((moon) => {
    const moonMesh = new THREE.Mesh(sph, moonMat); 
    moonMesh.scale.setScalar(moon.scale);
    moonMesh.position.x = moon.distance; 
    planetMesh.add(moonMesh);

    planetMesh.userData.moons.push({
      mesh: moonMesh,
      speed: moon.speed,
      distance: moon.distance,
      angle: 0
    });
  });

  if (planet.name === 'saturn') {
    const ring = new THREE.Mesh(ringGeometry, satRingmat);
    ring.rotation.x = Math.PI / 2;
    ring.scale.setScalar(0.07)
    planetMesh.add(ring);
  }

  if (planet.name === 'uranus') {
    const ring = new THREE.Mesh(ringGeometry, uranRingmat);
    ring.rotation.x = Math.PI / 2;
    ring.scale.setScalar(0.07)
    planetMesh.add(ring);
  }

  return planetMesh;
});

const res = window.innerWidth/window.innerHeight;

const cam = new THREE.PerspectiveCamera(
  75,
  res,
  0.01,
  100000
)
cam.position.y=700;
cam.position.z=2000;

const light = new THREE.AmbientLight('white',0.18);
scene.add(light);
const pointLight = new THREE.PointLight('white',0.7);
pointLight.position.set(0,0,0);
pointLight.intensity = 400000;

scene.add(pointLight);

const canvas = document.querySelector('canvas.threejs');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.25));

const controls = new OrbitControls(cam,canvas);
controls.enableDamping = true;

window.addEventListener('resize', () =>{
  cam.aspect = window.innerWidth/window.innerHeight
  cam.updateProjectionMatrix()
  renderer.setSize(window.innerWidth,window.innerHeight)
})

const renderloop = () => {
  sun.rotation.y-=0.00004
  planetArr.forEach((planet,i)=>{
    planet.rotation.y += planets[i].speed;
    planets[i].orbitAngle = (planets[i].orbitAngle || 0) + Math.abs(planets[i].speed);
    planet.position.x = Math.sin(planets[i].orbitAngle) * planets[i].posn;
    planet.position.z = Math.cos(planets[i].orbitAngle) * planets[i].posn;

    const moonData = planet.userData.moons;
    moonData.forEach((moon) => {
      moon.angle += moon.speed;
      moon.mesh.position.x = Math.sin(moon.angle) * moon.distance;
      moon.mesh.position.z = Math.cos(moon.angle) * moon.distance;
    });
  })

  cam.aspect = window.innerWidth/window.innerHeight
  cam.updateProjectionMatrix()

  controls.update()
  
  renderer.setSize(window.innerWidth,window.innerHeight)

  renderer.render(scene,cam)
  window.requestAnimationFrame(renderloop)
}

renderloop()

// const fog = new THREE.Fog('white',1,10)
// scene.fog = fog
// scene.background = new THREE.Color("")
// const axes = new THREE.AxesHelper(1000)
// scene.add(axes)