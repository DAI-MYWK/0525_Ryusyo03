// Advanced Three.js Scene for Ryusho Group
function initThreeJS() {
  const container = document.getElementById("three-container");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Create Asia-focused world map
  const earthGeometry = new THREE.SphereGeometry(6, 128, 128);
  const earthMaterial = new THREE.MeshBasicMaterial({
    color: 0x1a4b8c,
    wireframe: true,
    transparent: true,
    opacity: 0.3,
  });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earth);

  // Key Asian cities and business hubs
  const businessHubs = [
    { name: "Tokyo", lat: 35.6762, lng: 139.6503, color: 0xff0066 }, // Japan HQ
    { name: "Shanghai", lat: 31.2304, lng: 121.4737, color: 0xff3366 }, // China operations
    { name: "Hong Kong", lat: 22.3193, lng: 114.1694, color: 0xff6699 },
    { name: "Singapore", lat: 1.3521, lng: 103.8198, color: 0xff0033 },
    { name: "Seoul", lat: 37.5665, lng: 126.978, color: 0xff4455 },
    { name: "Bangkok", lat: 13.7563, lng: 100.5018, color: 0xff2244 },
    { name: "Kuala Lumpur", lat: 3.139, lng: 101.6869, color: 0xff5577 },
    { name: "Jakarta", lat: -6.2088, lng: 106.8456, color: 0xff1133 },
  ];

  const nodes = [];
  const connections = [];
  const businessPulses = [];

  // Create business hub nodes
  businessHubs.forEach((hub) => {
    const phi = (90 - hub.lat) * (Math.PI / 180);
    const theta = (hub.lng + 180) * (Math.PI / 180);

    const x = 6.3 * Math.sin(phi) * Math.cos(theta);
    const y = 6.3 * Math.cos(phi);
    const z = 6.3 * Math.sin(phi) * Math.sin(theta);

    const nodeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: hub.color });
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.set(x, y, z);
    node.userData = { name: hub.name, color: hub.color };
    nodes.push(node);
    scene.add(node);
  });

  // Create business connections (trade routes)
  const mainRoutes = [
    [0, 1], // Tokyo-Shanghai
    [0, 2], // Tokyo-Hong Kong
    [1, 2], // Shanghai-Hong Kong
    [2, 3], // Hong Kong-Singapore
    [0, 4], // Tokyo-Seoul
    [3, 5], // Singapore-Bangkok
    [3, 6], // Singapore-KL
    [3, 7], // Singapore-Jakarta
  ];

  mainRoutes.forEach((route) => {
    const startNode = nodes[route[0]];
    const endNode = nodes[route[1]];

    const points = [];
    points.push(startNode.position);
    points.push(endNode.position);

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0xff0066,
      transparent: true,
      opacity: 0.6,
    });
    const line = new THREE.Line(geometry, material);
    connections.push(line);
    scene.add(line);

    // Add business data pulses
    const pulseGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const pulseMaterial = new THREE.MeshBasicMaterial({
      color: 0xff3366,
      transparent: true,
      opacity: 0.8,
    });
    const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
    pulse.userData = {
      start: startNode.position.clone(),
      end: endNode.position.clone(),
      progress: Math.random(),
    };
    businessPulses.push(pulse);
    scene.add(pulse);
  });

  // Create company orbital rings (representing 4 companies)
  const companyColors = [0xff0066, 0xff3366, 0xff6699, 0xff0033];
  const orbitalRings = [];

  companyColors.forEach((color, index) => {
    const radius = 8 + index * 1.5;
    const orbitGeometry = new THREE.TorusGeometry(radius, 0.03, 8, 100);
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.4,
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2 + index * 0.2;
    orbit.rotation.y = index * 0.5;
    orbitalRings.push(orbit);
    scene.add(orbit);
  });

  // Enhanced particle system for data flow
  const particleCount = 300;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);
  const particleVelocities = [];

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const radius = 8 + Math.random() * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i3 + 1] = radius * Math.cos(phi);
    particlePositions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

    particleVelocities.push({
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.02,
    });

    // Different shades of red for different data types
    const colorChoice = Math.random();
    if (colorChoice < 0.25) {
      particleColors[i3] = 1;
      particleColors[i3 + 1] = 0;
      particleColors[i3 + 2] = 0.4; // Red - Axia
    } else if (colorChoice < 0.5) {
      particleColors[i3] = 1;
      particleColors[i3 + 1] = 0.2;
      particleColors[i3 + 2] = 0.4; // Pink - KRET
    } else if (colorChoice < 0.75) {
      particleColors[i3] = 1;
      particleColors[i3 + 1] = 0.4;
      particleColors[i3 + 2] = 0.6; // Light Red - えにしショップ
    } else {
      particleColors[i3] = 1;
      particleColors[i3 + 1] = 0;
      particleColors[i3 + 2] = 0.2; // Dark Red - FeLiCe
    }
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3)
  );
  particleGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(particleColors, 3)
  );
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.06,
    transparent: true,
    opacity: 0.8,
    vertexColors: true,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // Position camera
  camera.position.z = 20;
  camera.position.y = 5;

  // Animation
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    // Rotate Earth slowly
    earth.rotation.y += 0.002;

    // Animate business hub nodes
    nodes.forEach((node, index) => {
      const scale = 1 + Math.sin(time * 2 + index) * 0.3;
      node.scale.setScalar(scale);
    });

    // Animate business data pulses
    businessPulses.forEach((pulse) => {
      pulse.userData.progress += 0.015;
      if (pulse.userData.progress > 1) pulse.userData.progress = 0;

      const start = pulse.userData.start;
      const end = pulse.userData.end;
      const progress = pulse.userData.progress;

      pulse.position.lerpVectors(start, end, progress);
      pulse.material.opacity = Math.sin(progress * Math.PI) * 0.8;

      // Scale effect
      const scale = 0.5 + Math.sin(progress * Math.PI * 2) * 0.5;
      pulse.scale.setScalar(scale);
    });

    // Animate company orbital rings
    orbitalRings.forEach((ring, index) => {
      ring.rotation.z += 0.005 + index * 0.002;

      // Breathing effect
      const breathe = 1 + Math.sin(time + index) * 0.1;
      ring.scale.setScalar(breathe);
    });

    // Animate connections with data flow
    connections.forEach((connection, index) => {
      const opacity = 0.3 + Math.sin(time * 2 + index * 0.5) * 0.3;
      connection.material.opacity = Math.max(0.1, opacity);
    });

    // Animate particles with orbital motion
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] += particleVelocities[i].x;
      positions[i3 + 1] += particleVelocities[i].y;
      positions[i3 + 2] += particleVelocities[i].z;

      // Orbital bounds
      const distance = Math.sqrt(
        positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2
      );
      if (distance > 20 || distance < 7) {
        particleVelocities[i].x *= -1;
        particleVelocities[i].y *= -1;
        particleVelocities[i].z *= -1;
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;

    // Camera movement focusing on Asia-Pacific region
    camera.position.x = Math.sin(time * 0.05) * 18;
    camera.position.z = Math.cos(time * 0.05) * 18;
    camera.position.y = 5 + Math.sin(time * 0.03) * 2;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  // Handle resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Terminal typing animation
function initTerminalText() {
  const terminal = document.getElementById("terminalText");
  const messages = [
    "> Connecting Asian markets...",
    "> Establishing trade routes...",
    "> Optimizing logistics network...",
    "> Dragon systems: ENGAGED",
    "> Global dominance: ACTIVE",
  ];

  let messageIndex = 0;
  let charIndex = 0;
  let isTyping = true;

  function typeMessage() {
    if (messageIndex < messages.length) {
      if (isTyping) {
        if (charIndex < messages[messageIndex].length) {
          terminal.innerHTML =
            messages[messageIndex].substring(0, charIndex + 1) +
            '<span style="animation: blink 1s infinite;">_</span>';
          charIndex++;
          setTimeout(typeMessage, 50 + Math.random() * 50);
        } else {
          isTyping = false;
          setTimeout(typeMessage, 2000);
        }
      } else {
        messageIndex++;
        charIndex = 0;
        isTyping = true;
        if (messageIndex >= messages.length) {
          messageIndex = 0;
        }
        setTimeout(typeMessage, 500);
      }
    }
  }

  setTimeout(typeMessage, 1000);
}

// Navigation and smooth scrolling
function initNavigation() {
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-item");

  function updateActiveNav() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollY >= sectionTop - viewportHeight / 2 &&
        scrollY < sectionTop + sectionHeight - viewportHeight / 2
      ) {
        navItems.forEach((item) => item.classList.remove("active"));
        if (navItems[index]) navItems[index].classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);

  navItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      if (sections[index]) {
        sections[index].scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// Form handling
function initForm() {
  const form = document.querySelector(".contact-form form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Simple form validation and submission effect
    const submitBtn = form.querySelector(".submit-btn");
    const originalText = submitBtn.textContent;

    submitBtn.textContent = "送信中...";
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = "送信完了！";
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.reset();
      }, 2000);
    }, 1500);
  });
}

// Intersection Observer for animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document
    .querySelectorAll(
      ".value-card, .company-card, .partnership-card, .ceo-message"
    )
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(50px)";
      el.style.transition = "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      observer.observe(el);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initThreeJS();
  initTerminalText();
  initNavigation();
  initForm();
  initScrollAnimations();
});

// Parallax effect for sections
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const dataStreams = document.querySelectorAll(".data-stream");

  dataStreams.forEach((stream, index) => {
    const rate = scrolled * -0.3 * (index + 1);
    stream.style.transform = `translateY(${rate}px)`;
  });
});
