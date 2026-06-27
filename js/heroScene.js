let scene, camera, renderer, cubeGroup;

window.initHeroScene = function() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 8;
    camera.position.x = 2; // Offset slightly to the right so text has space

    if (window.innerWidth < 768) {
        camera.position.x = 0;
        camera.position.z = 10;
    }

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create Floating Rules Cube
    cubeGroup = new THREE.Group();

    const gridSize = 3;
    const spacing = 0.55;
    const geometry = new THREE.BoxGeometry(0.45, 0.45, 0.45);
    
    // Glossy fintech material
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x01696f,
        metalness: 0.1,
        roughness: 0.2,
        transparent: true,
        opacity: 0.85,
        transmission: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x02949d, transparent: true, opacity: 0.4 });

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            for (let z = 0; z < gridSize; z++) {
                // Don't fill the absolute center
                if (x === 1 && y === 1 && z === 1) continue;

                const mesh = new THREE.Mesh(geometry, material);
                
                // Position
                mesh.position.x = (x - 1) * spacing;
                mesh.position.y = (y - 1) * spacing;
                mesh.position.z = (z - 1) * spacing;
                
                // Save original position for explode effect
                mesh.userData.origPos = mesh.position.clone();

                // Add edges
                const edges = new THREE.EdgesGeometry(geometry);
                const line = new THREE.LineSegments(edges, edgeMaterial);
                mesh.add(line);

                cubeGroup.add(mesh);
            }
        }
    }

    // Tilt the whole group initially
    cubeGroup.rotation.x = Math.PI * 0.1;
    cubeGroup.rotation.y = Math.PI * 0.25;

    scene.add(cubeGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x02949d, 2, 10);
    pointLight.position.set(-2, 2, 2);
    scene.add(pointLight);

    // Handle Resize
    window.addEventListener('resize', onWindowResize);

    // Animation Loop
    gsap.ticker.add(animate);
};

function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (window.innerWidth < 768) {
        camera.position.x = 0;
        camera.position.z = 10;
    } else {
        camera.position.x = 2;
        camera.position.z = 8;
    }
}

// Expose scroll update function for GSAP ScrollTrigger
window.updateHeroSceneOnScroll = function(progress) {
    if (cubeGroup) {
        // Expand the blocks slightly as user scrolls down
        const expansion = progress * 1.5;
        cubeGroup.children.forEach(child => {
            child.position.x = child.userData.origPos.x * (1 + expansion);
            child.position.y = child.userData.origPos.y * (1 + expansion);
            child.position.z = child.userData.origPos.z * (1 + expansion);
        });

        // Rotate the entire group
        cubeGroup.rotation.y = Math.PI * 0.25 + (progress * Math.PI);
        
        // Push it back slightly
        cubeGroup.position.z = -(progress * 2);
    }
};

function animate(time) {
    if (cubeGroup) {
        // Idle rotation
        cubeGroup.rotation.x += 0.001;
        cubeGroup.rotation.y += 0.002;
        
        // Gentle float
        cubeGroup.position.y = Math.sin(time) * 0.1;
    }
    renderer.render(scene, camera);
}
