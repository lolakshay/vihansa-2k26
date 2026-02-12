jQuery(document).ready(function ($) {

  // SRIT Intro Overlay Logic
  setTimeout(function () {
    $('#srit-intro-overlay').addClass('fade-out');
    setTimeout(function () {
      $('#srit-intro-overlay').remove();
    }, 500); // 0.5s fade out
  }, 3000); // 3s animation duration
  /******************************
   * 1. INITIALIZE LIBRARIES
   ******************************/
  new WOW().init(); // Initialize WOW.js animations

  // Venobox Lightbox
  $('.venobox').venobox({
    bgcolor: '',
    overlayColor: 'rgba(6, 12, 34, 0.85)',
    closeBackground: '',
    closeColor: '#fff'
  });

  // Superfish Dropdowns
  $('.nav-menu').superfish({
    animation: { opacity: 'show' },
    speed: 400
  });

  /******************************
   * 2. HEADER & SCROLL BEHAVIOR
   ******************************/
  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }

    // Header fixed on scroll
    if ($(this).scrollTop() > 40) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  $('.back-to-top').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
    return false;
  });

  /******************************
   * 3. MOBILE NAVIGATION
   ******************************/
  if ($('#nav-menu-container').length) {
    var $mobile_nav = $('#nav-menu-container').clone().prop({ id: 'mobile-nav' });
    $mobile_nav.find('> ul').attr({ 'class': '', 'id': '' });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
    $('body').append('<div id="mobile-body-overly"></div>');
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

    $(document).on('click', '.menu-has-children i', function (e) {
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass("fa-chevron-up fa-chevron-down");
    });

    $(document).on('click', '#mobile-nav-toggle', function (e) {
      $('body').toggleClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
      $('#mobile-body-overly').toggle();
    });

    $(document).click(function (e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
      }
    });
  }

  /******************************
   * 4. SMOOTH SCROLLING
   ******************************/
  $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = $('#header').length ? $('#header').outerHeight() - ($('#header').hasClass('header-fixed') ? 0 : 20) : 0;

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu').length) {
          $('.nav-menu .menu-active').removeClass('menu-active');
          $(this).closest('li').addClass('menu-active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
        return false;
      }
    }
  });

  /******************************
   * 5. CAROUSELS
   ******************************/
  // Main gallery carousel
  $(".gallery-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    center: true,
    responsive: { 0: 1, 768: 3, 992: 4, 1200: 5 }
  });

  // Events carousel
  $('.owl-show-events').owlCarousel({
    items: 4,
    loop: true,
    dots: true,
    nav: true,
    autoplay: true,
    margin: 30,
    responsive: { 0: 1, 600: 2, 1000: 4 }
  });

  // Gallery scroll function
  function setupInfiniteScroll() {
    const track = document.querySelector('.gallery-track');
    if (!track) return;

    // Clone and append items for seamless looping
    const items = track.querySelectorAll('.gallery-item');
    items.forEach(item => {
      track.appendChild(item.cloneNode(true));
    });

    let position = 0;
    const speed = 1; // Adjust speed (px per frame)

    function animate() {
      position -= speed;

      // Reset position when halfway through duplicated content
      if (position <= -track.scrollWidth / 2) {
        position = 0;
      }

      track.style.transform = `translateX(${position}px)`;
      requestAnimationFrame(animate);
    }

    // Start animation only when hovered (optional)
    track.addEventListener('mouseenter', () => {
      track.style.animationPlayState = 'paused';
    });

    track.addEventListener('mouseleave', () => {
      track.style.animationPlayState = 'running';
    });

    requestAnimationFrame(animate);
  }

  setupInfiniteScroll();

  /******************************
   * 6. COUNTDOWN TIMER
   ******************************/
  const second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24;
  let countDown = new Date("03-05-2026").getTime();

  let x = setInterval(function () {
    let now = new Date().getTime(), distance = countDown - now;

    let daysElement = document.getElementById('days');
    if (daysElement) {
      daysElement.innerText = Math.floor(distance / day);
      document.getElementById('hours').innerText = Math.floor((distance % day) / hour);
      document.getElementById('minutes').innerText = Math.floor((distance % hour) / minute);
      document.getElementById('seconds').innerText = Math.floor((distance % minute) / second);
    }

    if (distance < 0) clearInterval(x);
  }, second);

  /******************************
   * 7. CONFETTI EFFECT
   ******************************/
  const prizeSection = document.querySelector("#intro");
  if (prizeSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fireConfetti();
        observer.unobserve(prizeSection);
      }
    }, { threshold: 0.5 });
    observer.observe(prizeSection);
  }
});

/******************************
 * 8. GALLERY POPUP FUNCTIONS
 ******************************/
function openPopup(image, title, coordinators, faculty) {
  document.getElementById('popupImage').src = 'img/events-main/' + image;
  document.getElementById('popupTitle').textContent = title;

  // Update coordinators
  const coordList = document.getElementById('popupCoordinators');
  coordList.innerHTML = coordinators.map(c => `<li style="color: White";>${c}</li>`).join('');

  // Update faculty
  const facultyList = document.getElementById('popupFaculty');
  facultyList.innerHTML = faculty.map(f => `<li style="color: White">${f}</li>`).join('');

  document.getElementById('eventPopup').style.display = 'block';
  document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closePopup() {
  document.getElementById('eventPopup').style.display = 'none';
  document.body.style.overflow = 'auto'; // Re-enable scrolling
}

/******************************
 * 9. CONFETTI FUNCTION
 ******************************/
function fireConfetti() {
  confetti({ particleCount: 200, spread: 200, origin: { x: 1, y: 0 } });
  confetti({ particleCount: 200, spread: 200, origin: { x: 0, y: 0 } });
}

/******************************
 * 10. MOBILE VIEWPORT FIX
 ******************************/
if (window.matchMedia("(max-width: 767px)").matches) {
  $('#intro').css({ height: $(window).height() });
}

/* ==========================================================================
   Main Events - Dynamic Loading & Scroll Reveal
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  // Function to load main events from JSON
  const loadMainEvents = async () => {
    const stage = document.querySelector('.events-stage');
    if (!stage) return;

    try {
      const response = await fetch('events.json');
      if (!response.ok) throw new Error('Failed to load events');
      const data = await response.json();
      const mainEvents = data.mainEvents;

      if (!mainEvents || mainEvents.length === 0) return;

      // Clear loading/placeholder
      stage.innerHTML = '';

      // Generate HTML
      mainEvents.forEach((event, index) => {
        // No more rotation classes needed for the grid
        const cardHTML = `
                    <div class="event-card" style="opacity: 0;"> <!-- Start hidden for scroll reveal -->
                        <div class="event-card-inner">
                            <div class="event-image">
                                <img src="${event.image}" alt="${event.title}">
                                <div class="event-overlay"></div>
                                <div class="event-type-tag">${event.tag}</div>
                            </div>
                            <div class="event-content">
                                <h3>${event.title}</h3>
                                <p>${event.description}</p>
                                <div class="event-meta">
                                    ${event.meta.map(m => `<span><i class="fa ${m.icon}"></i> ${m.text}</span>`).join('')}
                                </div>
                                <a href="${event.link}" class="me-cta-btn">${event.cta} <i class="fa fa-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>
                `;
        stage.innerHTML += cardHTML;
      });

      // Initialize Effects AFTER rendering
      initScrollReveal();

    } catch (error) {
      console.error('Error loading main events:', error);
      stage.innerHTML = '<p class="text-center text-white">Events loading...</p>';
    }
  };

  // Scroll Reveal Logic - Simplified for Grid
  const initScrollReveal = () => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          const stageCards = entry.target.querySelectorAll('.event-card');
          stageCards.forEach((card, index) => {
            // Apply scale-in animation with staggered delay
            card.style.animation = `scaleInCard 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards ${index * 0.15}s`;
          });
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const mainEventsSection = document.querySelector('#main-events');
    if (mainEventsSection) {
      observer.observe(mainEventsSection);
    }
  };

  // Kick off the loading
  loadMainEvents();
});


/* ==========================================================================
   LIGHTNING TIMELINE LOGIC
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const agendaSection = document.querySelector('.stranger-agenda');
  if (!agendaSection) return;

  // Get lightning path
  const lightningPath = document.querySelector("#st-mainLightning");

  if (lightningPath) {
    // Initialize stroke dash for animation
    const length = lightningPath.getTotalLength();
    lightningPath.style.strokeDasharray = length;
    lightningPath.style.strokeDashoffset = length; // Start hidden
  }

  // Switch Day Function - Global
  window.switchSTDay = function (day) {
    // Hide all days
    document.querySelectorAll('.st-day').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.st-tab').forEach(t => t.classList.remove('active'));

    // Show selected day
    document.getElementById(`st-day${day}`).classList.add('active');
    document.querySelector(`.st-day${day}-btn`).classList.add('active');
  };

  // Scroll-based lightning draw animation
  window.addEventListener("scroll", () => {
    if (!lightningPath) return;

    const sectionTop = agendaSection.offsetTop;
    const sectionHeight = agendaSection.offsetHeight;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Determine how far we are into the section
    // Start drawing when section enters viewport
    const startOffset = sectionTop - windowHeight * 0.9;
    const endOffset = sectionTop + sectionHeight - windowHeight * 0.9;

    let progress = (scrollY - startOffset) / (endOffset - startOffset);
    progress = Math.max(0, Math.min(1, progress));

    const length = lightningPath.getTotalLength();

    // Draw the lightning based on scroll
    // 1 - progress because we want 0 offset (full draw) at 100% progress
    lightningPath.style.strokeDashoffset = length * (1 - progress);
  });

  // Event Card Reveal Animation (Fly-in)
  const eventObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: "-50px" });

  document.querySelectorAll('.st-event').forEach(event => {
    eventObserver.observe(event);
  });
});
/* ==========================================================================
   GHOST CURSOR IMPLEMENTATION
   ========================================================================== */
class GhostCursor {
  constructor() {
    this.container = document.body;
    this.init();
  }

  init() {
    // Create container for the canvas
    this.canvasContainer = document.createElement('div');
    this.canvasContainer.id = 'ghost-cursor-canvas';
    this.canvasContainer.style.position = 'fixed';
    this.canvasContainer.style.top = '0';
    this.canvasContainer.style.left = '0';
    this.canvasContainer.style.width = '100%';
    this.canvasContainer.style.height = '100%';
    this.canvasContainer.style.pointerEvents = 'none';
    this.canvasContainer.style.zIndex = '-1';
    this.canvasContainer.style.mixBlendMode = 'screen'; // Blending mode
    document.body.appendChild(this.canvasContainer);

    // Configuration
    this.config = {
      trailLength: 50,
      inertia: 0.5,
      brightness: 1.5,
      color: '#ff0000', // Cyber Red
      baseColor: new THREE.Color('#ff0000'),
      maxDevicePixelRatio: 1.0
    };

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.config.maxDevicePixelRatio));
    this.canvasContainer.appendChild(this.renderer.domElement);

    // Setup scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.geometry = new THREE.PlaneGeometry(2, 2);

    // Initialize trail buffer
    const maxTrail = this.config.trailLength;
    this.trailBuf = Array.from({ length: maxTrail }, () => new THREE.Vector2(0.5, 0.5));

    // Create material
    this.material = this.createMaterial(maxTrail, this.config.baseColor);
    const mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(mesh);

    // State
    this.head = 0;
    this.currentMouse = new THREE.Vector2(0.5, 0.5);
    this.velocity = new THREE.Vector2(0, 0);
    this.fadeOpacity = 1.0;
    this.lastMoveTime = performance.now();
    this.pointerActive = false;
    this.running = false;
    this.startTime = performance.now();

    // Event Listeners
    this.bindEvents();
    this.ensureLoop();
  }

  createMaterial(maxTrail, baseColor) {
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float iTime;
      uniform vec3  iResolution;
      uniform vec2  iMouse;
      uniform vec2  iPrevMouse[${maxTrail}];
      uniform float iOpacity;
      uniform vec3  iBaseColor;
      uniform float iBrightness;
      varying vec2  vUv;

      float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7))) * 43758.5453123); }
      
      float noise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        f *= f * (3. - 2. * f);
        return mix(mix(hash(i + vec2(0.,0.)), hash(i + vec2(1.,0.)), f.x),
                   mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.,1.)), f.x), f.y);
      }
      
      float fbm(vec2 p){
        float v = 0.0;
        float a = 0.5;
        mat2 m = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for(int i=0;i<5;i++){
          v += a * noise(p);
          p = m * p * 2.0;
          a *= 0.5;
        }
        return v;
      }
      
      vec4 blob(vec2 p, vec2 mousePos, float intensity, float activity) {
        // High frequency noise for "electric" feel
        vec2 q = vec2(fbm(p * 2.0 + iTime * 0.1), fbm(p * 2.0 + vec2(5.2,1.3) + iTime * 0.1));
        float smoke = fbm(p * 3.0 + q * 2.5);
        
        float radius = 0.05; // Base radius
        float dist = length(p - mousePos);
        float distFactor = 1.0 - smoothstep(0.0, radius + 0.1 * activity, dist);
        
        float alpha = pow(smoke, 2.0) * distFactor;
        
        // Dynamic Color: Red to Gold/White
        vec3 c1 = iBaseColor;
        vec3 c2 = vec3(1.0, 0.8, 0.4); // Gold-ish
        vec3 color = mix(c1, c2, smoothstep(0.0, 0.2, dist));

        return vec4(color * alpha * intensity, alpha * intensity);
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
        vec2 mouse = (iMouse * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);

        vec3 colorAcc = vec3(0.0);
        float alphaAcc = 0.0;

        // Main blob - DISABLED for "Assessment" request (only trail wanted)
        // vec4 b = blob(uv, mouse, 1.0, iOpacity);
        // colorAcc += b.rgb;
        // alphaAcc += b.a;

        // Trail blobs
        for (int i = 0; i < ${maxTrail}; i++) {
          vec2 pm = (iPrevMouse[i] * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
          float t = 1.0 - float(i) / float(${maxTrail});
          t = pow(t, 2.0); // Non-linear fade
          if (t > 0.01) {
            vec4 bt = blob(uv, pm, t * 0.6, iOpacity);
            colorAcc += bt.rgb;
            alphaAcc += bt.a;
          }
        }

        colorAcc *= iBrightness;
        gl_FragColor = vec4(colorAcc, clamp(alphaAcc * iOpacity, 0.0, 1.0));
      }
    `;

    return new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1) },
        iMouse: { value: new THREE.Vector2(0.5, 0.5) },
        iPrevMouse: { value: this.trailBuf.map(v => v.clone()) },
        iOpacity: { value: 1.0 },
        iBaseColor: { value: baseColor },
        iBrightness: { value: this.config.brightness }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight, 1);
    });

    document.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;
      this.currentMouse.set(x, y);
      this.pointerActive = true;
      this.lastMoveTime = performance.now();
      this.fadeOpacity = 1.0;
      this.ensureLoop();
    });

    document.addEventListener('mouseenter', () => {
      this.pointerActive = true;
      this.ensureLoop();
    });

    document.addEventListener('mouseleave', () => {
      this.pointerActive = false;
      this.lastMoveTime = performance.now();
    });
  }

  animate = () => {
    const now = performance.now();
    const t = (now - this.startTime) / 1000;

    // Inertia & Fading
    if (!this.pointerActive) {
      this.velocity.multiplyScalar(this.config.inertia);
      this.material.uniforms.iMouse.value.add(this.velocity);

      // Fade out if inactive
      const dt = now - this.lastMoveTime;
      if (dt > 1000) { // 1 second delay
        this.fadeOpacity = Math.max(0, 1 - (dt - 1000) / 1000);
      }
    } else {
      this.velocity.set(
        this.currentMouse.x - this.material.uniforms.iMouse.value.x,
        this.currentMouse.y - this.material.uniforms.iMouse.value.y
      );
      this.material.uniforms.iMouse.value.copy(this.currentMouse);
    }

    // Update Trail Buffer
    const N = this.trailBuf.length;
    this.head = (this.head + 1) % N;
    this.trailBuf[this.head].copy(this.material.uniforms.iMouse.value);

    // Upload uniform array
    const arr = this.material.uniforms.iPrevMouse.value;
    for (let i = 0; i < N; i++) {
      const srcIdx = (this.head - i + N) % N;
      arr[i].copy(this.trailBuf[srcIdx]);
    }

    this.material.uniforms.iOpacity.value = this.fadeOpacity;
    this.material.uniforms.iTime.value = t;

    this.renderer.render(this.scene, this.camera);

    if (this.fadeOpacity <= 0.001 && !this.pointerActive) {
      this.running = false;
      return;
    }

    requestAnimationFrame(this.animate);
  }

  ensureLoop() {
    if (!this.running) {
      this.running = true;
      this.animate();
    }
  }
}

// Initialize on Load if not mobile
if (window.innerWidth > 768) {
  document.addEventListener('DOMContentLoaded', () => {
    // Check if THREE is loaded
    if (typeof THREE !== 'undefined') {
      new GhostCursor();
    } else {
      console.warn("Three.js not loaded, Ghost Cursor skipped.");
    }
  });
}
