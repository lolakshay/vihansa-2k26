// Hero 3D Animation using Three.js
// Red Particles Only - Floating over Video Background

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('hero-canvas');
  if (!container) return;

  // Scene Setup
  const scene = new THREE.Scene();
  // No fog for cleaner look
  scene.fog = new THREE.FogExp2(0x000000, 0.001);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // --- PARTICLES ONLY ---
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 2500;

  const posArray = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount; i++) {
    // Spread particles in a wide area
    posArray[i * 3] = (Math.random() - 0.5) * 120; // x
    posArray[i * 3 + 1] = (Math.random() - 0.5) * 120; // y
    posArray[i * 3 + 2] = (Math.random() - 0.5) * 120; // z
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.25,
    color: 0xff0000, // RED as requested
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // --- INTERACTION ---
  let mouseX = 0;
  let mouseY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
  });

  // --- ANIMATION ---
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Particles Interaction - gentle rotation based on mouse
    particlesMesh.rotation.y = -mouseX * 0.0001;
    particlesMesh.rotation.x = -mouseY * 0.0001;

    // Slow continuous rotation
    particlesMesh.rotation.y += 0.0005;

    // Camera Parallax - subtle movement
    camera.position.x += (mouseX * 0.005 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.005 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  // --- RESIZE ---
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
