// Three.js Background - Small Particles + Molecular Structures
// Keeping original website colors

let scene, camera, renderer, particles, molecules;
let mouseX = 0, mouseY = 0;

function initThreeScene() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create small particles
    createParticles();

    // Create molecular structures
    createMolecules();

    // Mouse interaction
    document.addEventListener('mousemove', onMouseMove);

    // Window resize
    window.addEventListener('resize', onWindowResize);

    // Animation loop
    animate();
}

function createParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: 0x14b8a6, // Teal - keeping original color
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
}

function createMolecules() {
    molecules = new THREE.Group();

    // Create 3 simple molecular structures
    const moleculePositions = [
        { x: -30, y: 15, z: -10 },  // Left
        { x: 30, y: -10, z: -15 },  // Right
        { x: 0, y: 20, z: -12 }     // Top center
    ];

    const colors = [0x14b8a6, 0x8b5cf6, 0xfb923c]; // Teal, Purple, Orange

    for (let i = 0; i < 3; i++) {
        const moleculeGroup = new THREE.Group();

        // Central atom
        const atomGeometry = new THREE.SphereGeometry(0.4, 16, 16);
        const atomMaterial = new THREE.MeshBasicMaterial({
            color: colors[i],
            transparent: true,
            opacity: 0.6
        });
        const atom = new THREE.Mesh(atomGeometry, atomMaterial);
        moleculeGroup.add(atom);

        // Surrounding atoms (3 atoms around center)
        for (let j = 0; j < 3; j++) {
            const smallAtom = new THREE.Mesh(
                new THREE.SphereGeometry(0.2, 12, 12),
                new THREE.MeshBasicMaterial({
                    color: colors[i],
                    transparent: true,
                    opacity: 0.4
                })
            );
            const angle = (j / 3) * Math.PI * 2;
            smallAtom.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0);
            moleculeGroup.add(smallAtom);

            // Connection lines
            const points = [new THREE.Vector3(0, 0, 0), smallAtom.position];
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const lineMaterial = new THREE.LineBasicMaterial({
                color: colors[i],
                transparent: true,
                opacity: 0.3
            });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            moleculeGroup.add(line);
        }

        moleculeGroup.position.set(
            moleculePositions[i].x,
            moleculePositions[i].y,
            moleculePositions[i].z
        );

        molecules.add(moleculeGroup);
    }

    scene.add(molecules);
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Gentle particle rotation
    if (particles) {
        particles.rotation.y += 0.0005;
        particles.rotation.x += 0.0003;
    }

    // Animate molecules - gentle floating
    if (molecules) {
        molecules.rotation.y += 0.001;
        molecules.children.forEach((molecule, index) => {
            molecule.rotation.y += 0.008;
            molecule.position.y += Math.sin(Date.now() * 0.0008 + index) * 0.008;
        });
    }

    // Subtle mouse interaction
    camera.position.x += (mouseX * 3 - camera.position.x) * 0.03;
    camera.position.y += (mouseY * 3 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initThreeScene);
