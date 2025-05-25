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
    "> Building logistics bridge...",
    "> Optimizing delivery routes...",
    "> Expanding global network...",
    "> Inventory system: ACTIVE",
    "> Delivery mission: READY",
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
  const navLinks = document.querySelectorAll(".nav-menu a");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  // Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav height
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });
  }

  // Update active nav item on scroll
  function updateActiveNav() {
    const sections = document.querySelectorAll("section");
    const scrollY = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);
}

// Form handling
function initForm() {
  const form = document.querySelector(".contact-form form");
  if (form) {
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
  const animatedElements = document.querySelectorAll(`
    .mission-item, 
    .business-card, 
    .location-card, 
    .philosophy-main,
    .feature-item,
    .value-item
  `);

  animatedElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(50px)";
    el.style.transition = "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    observer.observe(el);
  });
}

// Navbar background on scroll
function initNavbarScroll() {
  const nav = document.querySelector(".nav");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.style.background = "rgba(255, 255, 255, 0.98)";
      nav.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
      nav.style.background = "rgba(255, 255, 255, 0.95)";
      nav.style.boxShadow = "none";
    }
  });
}

// 左右からのフェードインエフェクト
function initSlideInAnimations() {
  const slideElements = document.querySelectorAll(
    ".slide-in-left, .slide-in-right"
  );

  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  slideElements.forEach((element) => {
    observer.observe(element);
  });
}

// 初期化関数を更新
document.addEventListener("DOMContentLoaded", function () {
  // 既存の初期化...
  initThreeJS();
  initTerminalText();
  initScrollAnimations();
  initNavigation();

  // カウンターアニメーションは即座に開始（ヒーローセクションのみ）
  animateCounters();

  // 新しいアニメーション初期化
  setTimeout(() => {
    initParticles();
    initFloatingElements();
    initDrawingAnimations();
    initTimelineAnimations();
    initTitleAnimations();
    initHoverEffects();
    initSlideInAnimations(); // 左右からのフェードイン
    createLeafParticles();
  }, 500);
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

// パーティクル初期化
function initParticles() {
  // 企業理念セクションのパーティクル
  if (document.getElementById("particles-philosophy")) {
    particlesJS("particles-philosophy", {
      particles: {
        number: { value: 50 },
        color: { value: "#e74c3c" },
        shape: { type: "circle" },
        opacity: { value: 0.3, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#e74c3c",
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
      },
      retina_detect: true,
    });
  }

  // ミッションセクションのパーティクル
  if (document.getElementById("particles-mission")) {
    particlesJS("particles-mission", {
      particles: {
        number: { value: 30 },
        color: { value: ["#e74c3c", "#ff6b6b", "#3498db"] },
        shape: {
          type: "polygon",
          polygon: { nb_sides: 6 },
        },
        opacity: { value: 0.4, random: true },
        size: { value: 4, random: true },
        move: {
          enable: true,
          speed: 1.5,
          direction: "top",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "bubble" },
          onclick: { enable: true, mode: "repulse" },
          resize: true,
        },
      },
      retina_detect: true,
    });
  }
}

// カウンターアニメーション（ヒーローセクションのみ）
function animateCounters() {
  const heroCounters = document.querySelectorAll(".hero-stats .stat-number");

  const observerOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute("data-target"));

        // 数値が有効かチェック
        if (isNaN(target)) {
          console.warn(
            "Invalid data-target value:",
            counter.getAttribute("data-target")
          );
          return;
        }

        const duration = 2000; // 2秒
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
          if (current < target) {
            current += increment;
            const displayValue = Math.floor(current);

            // 24時間対応の場合は「h」を追加
            if (
              counter.closest(".stat-item") &&
              counter.closest(".stat-item").querySelector(".stat-label")
                .textContent === "24時間対応"
            ) {
              counter.textContent = displayValue + "h";
            } else {
              counter.textContent = displayValue;
            }

            requestAnimationFrame(updateCounter);
          } else {
            // 最終値を設定
            if (
              counter.closest(".stat-item") &&
              counter.closest(".stat-item").querySelector(".stat-label")
                .textContent === "24時間対応"
            ) {
              counter.textContent = target + "h";
            } else {
              counter.textContent = target;
            }
          }
        };

        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, observerOptions);

  heroCounters.forEach((counter) => {
    observer.observe(counter);
  });
}

// フローティング要素のアニメーション
function initFloatingElements() {
  const floatingElements = document.querySelectorAll(".float-element");

  floatingElements.forEach((element, index) => {
    const delay = element.getAttribute("data-delay") || 0;

    setTimeout(() => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0) scale(1)";
    }, delay);

    // ホバー時の浮遊アニメーション
    element.addEventListener("mouseenter", () => {
      anime({
        targets: element,
        translateY: -10,
        scale: 1.1,
        duration: 300,
        easing: "easeOutQuad",
      });
    });

    element.addEventListener("mouseleave", () => {
      anime({
        targets: element,
        translateY: 0,
        scale: 1,
        duration: 300,
        easing: "easeOutQuad",
      });
    });
  });
}

// 手描き風SVGアニメーション
function initDrawingAnimations() {
  const drawPaths = document.querySelectorAll(".draw-path");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const path = entry.target;
          const length = path.getTotalLength();

          path.style.strokeDasharray = length;
          path.style.strokeDashoffset = length;

          anime({
            targets: path,
            strokeDashoffset: [length, 0],
            duration: 3000,
            easing: "easeInOutQuad",
            loop: true,
            direction: "alternate",
          });

          observer.unobserve(path);
        }
      });
    },
    { threshold: 0.5 }
  );

  drawPaths.forEach((path) => {
    observer.observe(path);
  });
}

// タイムラインアニメーション
function initTimelineAnimations() {
  const timelineItems = document.querySelectorAll(".timeline-item");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateX: [-30, 0],
            duration: 600,
            delay: index * 200,
            easing: "easeOutQuad",
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  timelineItems.forEach((item) => {
    observer.observe(item);
  });
}

// セクションタイトルのアニメーション
function initTitleAnimations() {
  const titles = document.querySelectorAll(".animate-title");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          anime({
            targets: entry.target,
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 1000,
            easing: "easeOutQuad",
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  titles.forEach((title) => {
    observer.observe(title);
  });
}

// ホバーエフェクト
function initHoverEffects() {
  // ミッションブロックのホバー
  const missionBlocks = document.querySelectorAll(".mission-block");
  missionBlocks.forEach((block) => {
    block.addEventListener("mouseenter", () => {
      anime({
        targets: block,
        translateY: -10,
        boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
        duration: 300,
        easing: "easeOutQuad",
      });
    });

    block.addEventListener("mouseleave", () => {
      anime({
        targets: block,
        translateY: 0,
        boxShadow: "0 15px 40px rgba(0, 0, 0, 0.1)",
        duration: 300,
        easing: "easeOutQuad",
      });
    });
  });

  // ビジネスタイルのホバー
  const businessTiles = document.querySelectorAll(".business-tile");
  businessTiles.forEach((tile) => {
    tile.addEventListener("mouseenter", () => {
      anime({
        targets: tile,
        scale: 1.05,
        duration: 300,
        easing: "easeOutQuad",
      });
    });

    tile.addEventListener("mouseleave", () => {
      anime({
        targets: tile,
        scale: 1,
        duration: 300,
        easing: "easeOutQuad",
      });
    });
  });
}

// 葉っぱのパーティクル（背景装飾）
function createLeafParticles() {
  const leafContainer = document.createElement("div");
  leafContainer.className = "leaf-particles";
  leafContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
  document.body.appendChild(leafContainer);

  function createLeaf() {
    const leaf = document.createElement("div");
    leaf.innerHTML = "🍃";
    leaf.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 20 + 10}px;
            opacity: ${Math.random() * 0.5 + 0.3};
            left: ${Math.random() * 100}%;
            top: -50px;
            pointer-events: none;
        `;

    leafContainer.appendChild(leaf);

    anime({
      targets: leaf,
      translateY: window.innerHeight + 100,
      translateX: Math.random() * 200 - 100,
      rotate: Math.random() * 360,
      duration: Math.random() * 3000 + 5000,
      easing: "linear",
      complete: () => {
        leaf.remove();
      },
    });
  }

  // 定期的に葉っぱを生成
  setInterval(createLeaf, 3000);
}
