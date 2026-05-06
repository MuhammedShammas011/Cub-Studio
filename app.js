/* ═══════════════════════════════════════════
   theCubStudio — Main Application Script
   Three.js 3D Hero · Scroll Reveals · Interactions
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {  // ─── Hero Entrance Animation ───
  setTimeout(() => {
    document.body.classList.add('hero-animate');
  }, 100);

  // ─── Slide Menu Toggle ───
  const hamburger = document.getElementById('hamburger');
  const slideMenu = document.getElementById('slideMenu');

  if (hamburger && slideMenu) {
    hamburger.addEventListener('click', () => {
      slideMenu.classList.toggle('active');
      const spans = hamburger.querySelectorAll('span');
      if (slideMenu.classList.contains('active')) {
        spans[0].style.transform = 'translateY(4px) rotate(45deg)';
        spans[1].style.width = '32px';
        spans[1].style.transform = 'translateY(-4px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.width = '20px';
        spans[1].style.transform = '';
      }
    });

    // Close menu when clicking a link
    const slideLinks = slideMenu.querySelectorAll('a');
    slideLinks.forEach(link => {
      link.addEventListener('click', () => {
        slideMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.width = '20px';
        spans[1].style.transform = '';
      });
    });
  }

  // ─── Navbar, Grid Parallax Effect ───
  const navbar = document.getElementById('navbar');
  const gridOverlay = document.getElementById('gridOverlay');

  window.addEventListener('scroll', () => {
    // Navbar background blur
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Grid Parallax Animation (Loops seamlessly based on 12.5vw cell size for 9 lines)
    if (gridOverlay) {
      const cellWidth = window.innerWidth * 0.125;
      const offset = -(window.scrollY * 0.15) % cellWidth;
      gridOverlay.style.transform = `translateX(${offset}px)`;
    }
  });

  // ─── Contact Modal Toggle ───
  const contactModal = document.getElementById('contactModal');
  const modalTriggers = document.querySelectorAll('#triggerContact, .modal-trigger');
  const closeModalBtn = document.getElementById('closeModal');
  const modalOverlay = document.getElementById('modalOverlay');

  if (contactModal) {
    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        contactModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Close slide menu if it's open
        if (slideMenu && slideMenu.classList.contains('active')) {
          hamburger.click();
        }
      });
    });

    const closeModal = () => {
      contactModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    closeModalBtn?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', closeModal);

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && contactModal.classList.contains('active')) {
        closeModal();
      }
    });

    // ─── AJAX Form Submission ───
    const contactForm = document.getElementById('contactForm');
    const notificationSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.submit-button');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        try {
          const response = await fetch(contactForm.action, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            notificationSound.play().catch(() => {}); // Play sound
            showToast('Message sent! We\'ll be in touch soon.');
            contactForm.reset();
            setTimeout(closeModal, 2000);
          } else {
            showToast('Oops! Something went wrong.', 'error');
          }
        } catch (error) {
          showToast('Connection error. Please try again.', 'error');
        } finally {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }
      });
    }
  }

  // Helper for toast notifications
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `<div class="toast-content"><span>${message}</span></div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 10);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // ─── Theme Toggle ───
  const themeToggle = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;
  const savedTheme = localStorage.getItem('cubstudio-theme');
  if (savedTheme) {
    htmlEl.setAttribute('data-theme', savedTheme);
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      htmlEl.setAttribute('data-theme', next);
      localStorage.setItem('cubstudio-theme', next);
    });
  }

  // ─── Testimonial Carousel ───
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  let currentSlide = 0;

  if (slides.length > 0) {
    const showSlide = (index) => {
      slides.forEach(slide => slide.classList.remove('active'));
      slides[index].classList.add('active');
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    };

    nextBtn?.addEventListener('click', () => {
      nextSlide();
      resetInterval();
    });

    prevBtn?.addEventListener('click', () => {
      prevSlide();
      resetInterval();
    });

    let slideInterval = setInterval(nextSlide, 3000);

    const resetInterval = () => {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 3000);
    };
  }

  // ─── Cursor-Following Heading Animation ───
  const parallaxHeadings = document.querySelectorAll('.huge-title, .howwe, .wordsmatter');

  document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    parallaxHeadings.forEach(heading => {
      // Only apply if the element is visible (revealed)
      if (heading.closest('.visible')) {
        const moveX = (clientX - centerX) * 0.015;
        const moveY = (clientY - centerY) * 0.015;
        heading.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      }
    });
  });

  // ─── About Section Word Reveal Animation ───
  const aboutHeadline = document.querySelector('.scroll-reveal-text');
  const revealWords = document.querySelectorAll('.reveal-word');

  if (aboutHeadline && revealWords.length > 0) {
    window.addEventListener('scroll', () => {
      const headlineRect = aboutHeadline.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Calculate progress: 0 when headline is at 80% of viewport, 1 when at 20%
      const startTrigger = viewportHeight * 0.85;
      const endTrigger = viewportHeight * 0.25;

      const progress = (startTrigger - headlineRect.top) / (startTrigger - endTrigger);
      const clampedProgress = Math.max(0, Math.min(1, progress));

      revealWords.forEach((word, index) => {
        // Distribute activation across the scroll progress
        const activationPoint = (index / (revealWords.length - 1)) * 0.8;
        if (clampedProgress > activationPoint) {
          word.classList.add('active');
        } else {
          word.classList.remove('active');
        }
      });
    });
  }

  // ─── Service Video Hover ───
  const serviceRows = document.querySelectorAll('.service-row');
  const serviceVideos = document.querySelectorAll('.service-video');
  const brandingVideo = document.getElementById('branding-video');
  const contentVideo = document.getElementById('content-video');
  const webVideo = document.getElementById('web-video');
  const performanceVideo = document.getElementById('performance-video');
  const previewContainer = document.querySelector('.service-preview-container');

  if (serviceRows.length > 0 && previewContainer) {
    serviceRows.forEach((row, index) => {
      row.addEventListener('mouseenter', () => {
        // Hide all videos first
        serviceVideos.forEach(v => {
          v.style.display = 'none';
          v.pause();
        });

        // Calculate vertical position to align with the current row
        const rowTop = row.offsetTop;
        previewContainer.style.setProperty('--preview-y', `${rowTop}px`);

        // Show and play the relevant video
        let targetVideo = null;
        if (index === 0) targetVideo = brandingVideo;
        else if (index === 1) targetVideo = contentVideo;
        else if (index === 2) targetVideo = performanceVideo; // Field 3 is index 2
        else if (index === 3) targetVideo = webVideo; // Field 4 is index 3

        if (targetVideo) {
          targetVideo.style.display = 'block';
          targetVideo.play().catch(e => console.log("Video play interrupted:", e));
          previewContainer.classList.add('active');
        } else {
          previewContainer.classList.remove('active');
        }
      });

      row.addEventListener('mouseleave', () => {
        previewContainer.classList.remove('active');
        serviceVideos.forEach(v => v.pause());
      });
    });
  }
  const particleField = document.getElementById('heroParticles');
  if (particleField) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (6 + Math.random() * 10) + 's';
      p.style.animationDelay = Math.random() * 8 + 's';
      p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
      particleField.appendChild(p);
    }
  }

  // ─── Scroll Reveal ───
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 100);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  // ─── Counter Animation ───
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const isFloat = target % 1 !== 0;
        const duration = 2000;
        const start = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * target;
          el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  // ─── 3D Cursor Tilt on Cards ───
  document.querySelectorAll('.service-row, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-10px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });

  // ─── Magnetic CTA Button ───
  document.querySelectorAll('.cta-button, .hero-cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ─── Smooth Scroll for Nav Links ───
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ─── THREE.JS Hero 3D Scene ───
  initHero3D();
});

function initHero3D() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 7;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ─── Lighting ───
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const keyLight = new THREE.PointLight(0xff4b00, 1.8, 25);
  keyLight.position.set(5, 5, 8);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0xff8040, 1.2, 20);
  fillLight.position.set(-6, -3, 5);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xffffff, 1, 18);
  rimLight.position.set(0, 5, -4);
  scene.add(rimLight);

  const bottomLight = new THREE.PointLight(0xff4b00, 0.6, 15);
  bottomLight.position.set(0, -5, 3);
  scene.add(bottomLight);

  // ─── Logo removal complete ───


  const glowRing2 = new THREE.Mesh(
    new THREE.TorusGeometry(3.4, 0.01, 8, 128),
    new THREE.MeshBasicMaterial({ color: 0xff4b00, transparent: true, opacity: 0.08 })
  );
  glowRing2.rotation.x = -Math.PI / 5;
  glowRing2.rotation.y = Math.PI / 6;
  scene.add(glowRing2);

  // ─── Logo Materials ───
  const logoMat = new THREE.MeshStandardMaterial({
    color: 0xff4b00,
    metalness: 0.1,
    roughness: 0.1,
    emissive: 0xff4b00,
    emissiveIntensity: 0.1,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  });
  const logoMatClone1 = logoMat.clone();
  const logoMatClone2 = logoMat.clone();

  const extrudeSettings = { depth: 0.6, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.05, bevelSegments: 5, curveSegments: 64 };

  // ─── Build Logo Shapes ───
  const R = 1.6;
  const topShape = new THREE.Shape();
  topShape.moveTo(-R, 0);
  topShape.absarc(0, 0, R, Math.PI, 0, false);
  topShape.lineTo(-R, 0);

  const bottomR = R * 0.72;
  const blShape = new THREE.Shape();
  blShape.moveTo(0, 0);
  blShape.absarc(0, 0, bottomR, Math.PI, Math.PI / 2, true);
  blShape.lineTo(0, 0);

  const brShape = new THREE.Shape();
  brShape.moveTo(0, 0);
  brShape.absarc(0, 0, bottomR, Math.PI / 2, 0, true);
  brShape.lineTo(0, 0);

  const topGeo = new THREE.ExtrudeGeometry(topShape, extrudeSettings);
  const blGeo = new THREE.ExtrudeGeometry(blShape, extrudeSettings);
  const brGeo = new THREE.ExtrudeGeometry(brShape, extrudeSettings);

  topGeo.center();
  blGeo.center();
  brGeo.center();

  const topMesh = new THREE.Mesh(topGeo, logoMat);
  const blMesh = new THREE.Mesh(blGeo, logoMatClone1);
  const brMesh = new THREE.Mesh(brGeo, logoMatClone2);

  topMesh.position.set(0, 1.05, 0);
  blMesh.position.set(-0.45, -0.7, 0);
  brMesh.position.set(0.55, -0.7, 0);

  const logoGroup = new THREE.Group();
  logoGroup.add(topMesh);
  logoGroup.add(blMesh);
  logoGroup.add(brMesh);
  logoGroup.scale.set(1.2, 1.2, 1.2);
  logoGroup.position.set(0, 0, -1.8);
  scene.add(logoGroup);

  const glowRing = new THREE.Mesh(
    new THREE.TorusGeometry(3, 0.015, 8, 128),
    new THREE.MeshBasicMaterial({ color: 0xff4b00, transparent: true, opacity: 0.15 })
  );
  glowRing.rotation.x = Math.PI / 4;
  scene.add(glowRing);
  // ─── Orbiting particles ───
  const particles = [];
  for (let i = 0; i < 8; i++) {
    const p = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xff4b00, emissive: 0xff4b00, emissiveIntensity: 0.8 })
    );
    scene.add(p);
    particles.push(p);
  }

  // ─── Mouse tracking ───
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // ─── Resize ───
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ─── Animation Loop ───
  function animate() {
    requestAnimationFrame(animate);
    const t = performance.now() * 0.001;

    // Logo group — gentle floating + cursor-follow rotation
    logoGroup.rotation.y = Math.sin(t * 0.3) * 0.15 + mouseX * 0.4;
    logoGroup.rotation.x = Math.sin(t * 0.25) * 0.08 + mouseY * 0.25;
    logoGroup.position.y = Math.sin(t * 0.5) * 0.2;

    // Each piece has its own micro-float for anti-gravity feel
    topMesh.position.y = 1.05 + Math.sin(t * 0.7) * 0.08;
    topMesh.rotation.z = Math.sin(t * 0.4) * 0.02;

    blMesh.position.y = -0.7 + Math.sin(t * 0.6 + 1) * 0.06;
    blMesh.position.x = -0.45 + Math.sin(t * 0.5 + 2) * 0.03;
    blMesh.rotation.z = Math.sin(t * 0.55) * 0.03;

    brMesh.position.y = -0.7 + Math.sin(t * 0.65 + 2) * 0.07;
    brMesh.position.x = 0.55 + Math.cos(t * 0.45 + 1) * 0.03;
    brMesh.rotation.z = Math.cos(t * 0.6) * 0.04;

    glowRing.rotation.z = t * 0.15;
    glowRing2.rotation.z = -t * 0.06;
    glowRing2.rotation.y = Math.PI / 6 + mouseX * 0.1;

    // Orbiting particles
    particles.forEach((p, i) => {
      const angle = t * 0.4 + (i / particles.length) * Math.PI * 2;
      const r = 3.2 + Math.sin(t + i) * 0.3;
      p.position.x = Math.cos(angle) * r;
      p.position.z = Math.sin(angle) * r * 0.5;
      p.position.y = Math.sin(angle * 1.5 + i * 0.8) * 1.2;
    });

    // Camera subtle parallax
    camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.02;
    camera.position.y += (mouseY * 0.4 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();
}
