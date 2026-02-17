jQuery(document).ready(function ($) {


  /******************************
   * 1. INITIALIZE LIBRARIES
   ******************************/

  // VOLUME CONTROLS (0.0 to 1.0)
  const VOL_BG_MUSIC = 0.3;      // Background Music
  const VOL_INTRO_VIDEO = 0.5;   // Intro Video
  const VOL_COUNTDOWN = 0.4;     // Countdown Ticker

  // Multi-Stage Preloader Logic
  $(window).on('load', function () {
    if ($('#preloader').length) {
      // Stage 1: "Searching the Upside Down" - show for 2 seconds
      setTimeout(function () {
        $('#loading-stage-1').fadeOut(500, function () {
          // Stage 2: "Portals are Open" - show for 1.5 seconds
          $('#loading-stage-2').fadeIn(500);

          setTimeout(function () {
            $('#loading-stage-2').fadeOut(500, function () {
              // Stage 3: "Dive into the Upside Down" button
              $('#loading-stage-3').fadeIn(500);
            });
          }, 1500);
        });
      }, 2000);

      // Handle dive button click - TRIGGER ALL AUDIO SOURCES + PORTAL TRANSITION
      $(document).on('click', '#dive-button', function () {
        // Show portal transition
        const portalTransition = document.getElementById('portal-transition');
        if (portalTransition) {
          portalTransition.style.display = 'flex';
          setTimeout(() => {
            portalTransition.classList.add('active');
          }, 10);
        }

        // Check if music is enabled in localStorage
        const musicEnabled = localStorage.getItem('musicEnabled') === 'true';

        if (musicEnabled) {
          // 1. Start countdown audio
          const countdownAudio = document.getElementById('countdown-audio');
          if (countdownAudio) {
            countdownAudio.volume = VOL_COUNTDOWN;
            countdownAudio.play().catch(error => {
              console.log("Countdown audio blocked:", error);
            });
          }

          // 2. Start background music
          const bgMusic = document.getElementById('bg-music');
          if (bgMusic) {
            bgMusic.volume = VOL_BG_MUSIC;
            bgMusic.play().catch(error => {
              console.log("Background music blocked:", error);
            });
          }

          // 3. Start intro video audio (unmute and play)
          const bgVideo = document.getElementById('bg-video');
          if (bgVideo) {
            bgVideo.muted = false;
            bgVideo.volume = VOL_INTRO_VIDEO;
            bgVideo.play().catch(error => {
              console.log("Video audio blocked:", error);
            });
          }
        } else {
          // Keep video muted if music is disabled
          const bgVideo = document.getElementById('bg-video');
          if (bgVideo) {
            bgVideo.muted = true;
          }
        }

        // Remove preloader after portal animation starts
        setTimeout(function () {
          $('#preloader').fadeOut(300, function () {
            $(this).remove();
          });
        }, 500);

        // Remove portal transition after animation completes
        setTimeout(function () {
          if (portalTransition) {
            portalTransition.style.opacity = '0';
            setTimeout(() => {
              portalTransition.remove();
            }, 500);
          }
        }, 1800);
      });
    }
  });

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
  // Back to top button & Header fixed - Throttled
  let scrollTicking = false;

  $(window).scroll(function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        const scrollTop = $(this).scrollTop();

        if (scrollTop > 100) {
          $('.back-to-top').fadeIn('slow');
        } else {
          $('.back-to-top').fadeOut('slow');
        }

        if (scrollTop > 40) {
          $('#header').addClass('header-scrolled');
        } else {
          $('#header').removeClass('header-scrolled');
        }

        scrollTicking = false;
      });
      scrollTicking = true;
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
   * 7. AUDIO FEEDBACK (MUSIC NOTES)
   ******************************/
  // User noted they don't have the file yet, using a placeholder.
  const clickSound = new Audio('audio/click-note.mp3');

  function playFeedbackSound() {
    // Reset and play to allow rapid clicks
    clickSound.currentTime = 0;
    clickSound.play().catch(error => {
      // Browsers often block audio until first interaction
      console.log("Audio playback delayed or blocked:", error);
    });
  }

  // 1. Listen for Tab clicks (Technical, Workshops, Culturals)
  $('.nav-tabs .nav-link').on('click', function () {
    playFeedbackSound();
  });

  // 2. Listen for Electric Card clicks (Individual events)
  $(document).on('click', '.electric-card', function () {
    playFeedbackSound();
  });

  /******************************
   * 8. MUSIC TOGGLE BUTTON - CONTROLS ALL AUDIO
   ******************************/
  const musicToggle = document.getElementById('music-toggle');
  const bgMusic = document.getElementById('bg-music');
  const countdownAudio = document.getElementById('countdown-audio');
  const bgVideo = document.getElementById('bg-video');
  const introSection = document.getElementById('intro');
  const aboutSection = document.getElementById('about');

  let musicEnabled = localStorage.getItem('musicEnabled') === 'true';
  let isIntroVisible = true; // Default start
  let isAboutVisible = false;

  // Initialize UI
  updateMusicButtonUI(musicEnabled);

  // Intersection Observer for Section Visibility
  const audioObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target.id === 'intro') {
        isIntroVisible = entry.isIntersecting;
      } else if (entry.target.id === 'about') {
        isAboutVisible = entry.isIntersecting;
      }
    });
    // Update audio state whenever visibility changes
    updateAudioState();
  }, { threshold: 0.3 }); // Trigger when 30% visible

  if (introSection) audioObserver.observe(introSection);
  if (aboutSection) audioObserver.observe(aboutSection);

  // Toggle Button Click Handler
  if (musicToggle) {
    musicToggle.addEventListener('click', function () {
      musicEnabled = !musicEnabled;
      localStorage.setItem('musicEnabled', musicEnabled);
      updateMusicButtonUI(musicEnabled);
      updateAudioState();
    });
  }

  // Central Audio State Manager
  function updateAudioState() {
    if (musicEnabled) {
      // 1. Ambient Music - Always plays if enabled
      if (bgMusic && bgMusic.paused) {
        bgMusic.volume = VOL_BG_MUSIC;
        bgMusic.play().catch(e => console.log("BG Music play failed", e));
      }

      // 2. Intro Video Audio - Only in Intro Section
      if (bgVideo) {
        if (isIntroVisible) {
          bgVideo.muted = false;
          bgVideo.volume = VOL_INTRO_VIDEO;
        } else {
          bgVideo.muted = true;
        }
      }

      // 3. Countdown Audio - Only in Countdown Section
      if (countdownAudio) {
        if (isAboutVisible) {
          countdownAudio.volume = VOL_COUNTDOWN;
          if (countdownAudio.paused) countdownAudio.play().catch(e => console.log("Countdown play failed", e));
        } else {
          countdownAudio.pause();
          countdownAudio.currentTime = 0; // Reset for next time
        }
      }

    } else {
      // GLOBAL MUTE - Stop everything
      if (bgMusic) bgMusic.pause();

      if (bgVideo) bgVideo.muted = true;

      if (countdownAudio) {
        countdownAudio.pause();
        countdownAudio.currentTime = 0;
      }
    }
  }

  // UI Helper
  function updateMusicButtonUI(isEnabled) {
    if (!musicToggle) return;
    if (isEnabled) {
      musicToggle.classList.add('playing');
      musicToggle.innerHTML = '<i class="fa fa-volume-up"></i>';
    } else {
      musicToggle.classList.remove('playing');
      musicToggle.innerHTML = '<i class="fa fa-volume-off"></i>';
    }
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
 * 9. 3D TILT EFFECT LOGIC
 ******************************/
const tiltContainer = document.getElementById('tiltContainer');
const tiltInner = document.getElementById('tiltInner');
const tiltShine = document.getElementById('tiltShine');

if (tiltContainer && tiltInner) {
  // Config
  const maxTilt = 15; // Max rotation in degrees

  // Mouse Move Event
  tiltContainer.addEventListener('mousemove', (e) => {
    const rect = tiltContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate percentages (0 to 1)
    const xPct = x / rect.width;
    const yPct = y / rect.height;

    // Calculate rotation (center is 0,0)
    // Y-axis rotation comes from X-position (left/right)
    // X-axis rotation comes from Y-position (up/down) - inverted
    const rotateY = (xPct - 0.5) * maxTilt * 2;
    const rotateX = (0.5 - yPct) * maxTilt * 2;

    // Apply Transform
    tiltInner.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale3d(1.05, 1.05, 1.05)
    `;

    // Shine Effect
    if (tiltShine) {
      tiltShine.style.opacity = '1';
      tiltShine.style.background = `
        radial-gradient(circle at ${x}px ${y}px, 
        rgba(255,255,255,0.2) 0%, 
        rgba(255,255,255,0) 80%)
      `;
    }
  });

  // Mouse Leave - Reset
  tiltContainer.addEventListener('mouseleave', () => {
    tiltInner.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      scale3d(1, 1, 1)
    `;

    // Smooth transition for reset
    tiltInner.style.transition = 'transform 0.5s ease-out';
    setTimeout(() => {
      tiltInner.style.transition = 'transform 0.1s ease-out'; // Reset to fast for next move
    }, 500);

    if (tiltShine) {
      tiltShine.style.opacity = '0';
    }
  });

  // Mouse Enter - Clear Reset Transition
  tiltContainer.addEventListener('mouseenter', () => {
    tiltInner.style.transition = 'transform 0.1s ease-out';
  });
}


/******************************
 * 9. CONFETTI FUNCTION
 ******************************/
function fireConfetti() {
  if (typeof confetti === 'function') {
    confetti({ particleCount: 200, spread: 200, origin: { x: 1, y: 0 } });
    confetti({ particleCount: 200, spread: 200, origin: { x: 0, y: 0 } });
  }
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

  // Scroll-based lightning draw animation - Optimized
  let lightningTicking = false;
  let cachedSectionTop = 0;
  let cachedSectionHeight = 0;
  let cachedWindowHeight = window.innerHeight;

  // Update cached values on resize
  window.addEventListener('resize', () => {
    cachedSectionTop = agendaSection.offsetTop;
    cachedSectionHeight = agendaSection.offsetHeight;
    cachedWindowHeight = window.innerHeight;
  });

  // Initial calculation
  cachedSectionTop = agendaSection.offsetTop;
  cachedSectionHeight = agendaSection.offsetHeight;

  window.addEventListener("scroll", () => {
    if (!lightningPath) return;

    if (!lightningTicking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Determine how far we are into the section
        const startOffset = cachedSectionTop - cachedWindowHeight * 0.9;
        const endOffset = cachedSectionTop + cachedSectionHeight - cachedWindowHeight * 0.9;

        let progress = (scrollY - startOffset) / (endOffset - startOffset);
        progress = Math.max(0, Math.min(1, progress));

        const length = lightningPath.getTotalLength(); // Accessing this is still expensive but improved by refactoring the rest
        lightningPath.style.strokeDashoffset = length * (1 - progress);

        lightningTicking = false;
      });
      lightningTicking = true;
    }
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
    this.canvasContainer.style.zIndex = '9999';
    this.canvasContainer.style.mixBlendMode = 'screen'; // Blending mode
    document.body.appendChild(this.canvasContainer);

    // Configuration
    this.config = {
      trailLength: 20, // Optimized from 50
      inertia: 0.5,
      brightness: 1.5,
      color: '#ff0000', // Cyber Red
      baseColor: new THREE.Color('#ff0000'),
      maxDevicePixelRatio: 1.25 // Cap for performance but allow >1 for high-end
    };

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      premultipliedAlpha: false
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Initial DPR Setup
    this.currentDPR = Math.min(window.devicePixelRatio, this.config.maxDevicePixelRatio);
    this.renderer.setPixelRatio(this.currentDPR);
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
        
        float radius = 0.02; // Base radius
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
      this.currentDPR = Math.min(window.devicePixelRatio, this.config.maxDevicePixelRatio);
      this.renderer.setPixelRatio(this.currentDPR);
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
      this.startDPRAdjustment();
    }
  }

  startDPRAdjustment() {
    if (this.dprInterval) return; // Already running

    let lastTime = performance.now();
    let frameCount = 0;

    const adjustDPR = () => {
      // If animation stopped, stop this loop too
      if (!this.running) {
        this.dprInterval = null;
        return;
      }

      frameCount++;
      const now = performance.now();
      const elapsed = now - lastTime;

      if (elapsed >= 1000) {
        const fps = (frameCount * 1000) / elapsed;

        if (fps < 40 && this.currentDPR > 1) {
          this.currentDPR = Math.max(1, this.currentDPR - 0.1);
          this.renderer.setPixelRatio(this.currentDPR);
          // console.log(`Low FPS (${fps.toFixed(1)}), reducing DPR to ${this.currentDPR.toFixed(2)}`);
        }

        if (fps > 60 && this.currentDPR < this.config.maxDevicePixelRatio) {
          this.currentDPR = Math.min(this.config.maxDevicePixelRatio, this.currentDPR + 0.1);
          this.renderer.setPixelRatio(this.currentDPR);
          // console.log(`High FPS (${fps.toFixed(1)}), increasing DPR to ${this.currentDPR.toFixed(2)}`);
        }

        frameCount = 0;
        lastTime = now;
      }

      this.dprInterval = requestAnimationFrame(adjustDPR);
    };

    adjustDPR();
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

/* ==========================================================================
   EVENT DETAILS MODAL LOGIC
   ========================================================================== */

// Event Data - Extensible for all events
const eventDetails = {
  // Technical Events
  'promptly': {
    title: 'PROMPTLY',
    desc: `<div class="event-full-desc">
      <p><strong>PROMPTLY – The Prompt Engineering Challenge</strong> is an innovative technical competition that tests participants' creativity, logical thinking, and ability to communicate effectively with AI systems. The event consists of two competitive rounds conducted in a timed environment.</p>
      
      <h3>📋 Rules</h3>
      <ul>
        <li>Copying prompts, code, or outputs from other participants or external sources without permission will result in disqualification.</li>
        <li>Using paid AI tools, unapproved platforms, or external assistance beyond the allowed resources is strictly prohibited.</li>
        <li>If the rules specify prompt-only generation, excessive manual editing or bypassing AI generation rules will lead to disqualification.</li>
        <li>Late submission, sharing answers, disruptive behavior, or any form of misconduct during the event will result in disqualification.</li>
        <li>The decision of the Jury Panel and the Event Coordinator will be final and binding in all matters related to the competition.</li>
      </ul>

      <h3>🎯 Round 1: Image Generation</h3>
      <p><strong>Objective:</strong> Evaluate participants' ability to effectively communicate with AI image generation systems using well-structured prompts.</p>
      <ul>
        <li><strong>Team Type:</strong> 2 Members per team</li>
        <li><strong>Duration:</strong> 30 Minutes</li>
        <li><strong>Platform:</strong> Free Image Generation Tool (Craiyon)</li>
        <li><strong>Type:</strong> Elimination Round</li>
      </ul>
      
      <p><strong>Task Description:</strong> Transform a given base image according to specified requirements using only prompt-based instructions.</p>
      
      <p><strong>Challenge Requirements:</strong></p>
      <ul>
        <li>Changing the artistic style (e.g., cinematic, cyberpunk, watercolor, realistic)</li>
        <li>Modifying lighting conditions (e.g., sunset, neon lighting, dramatic shadows)</li>
        <li>Adding or removing specific elements</li>
        <li>Preserving key features (e.g., facial expression, subject identity, camera angle)</li>
        <li>Maintaining required aspect ratio (e.g., 16:9 or 1:1)</li>
      </ul>

      <p><strong>Prompt Rules:</strong></p>
      <ul>
        <li>Maximum word limit: 120 words</li>
        <li>Participants must submit the exact prompt used</li>
        <li>No external editing tools are allowed</li>
        <li>No use of paid AI tools</li>
        <li>Only approved free platforms may be used</li>
      </ul>

      <p><strong>Evaluation Criteria:</strong></p>
      <table style="width:100%; border-collapse: collapse; margin: 10px 0;">
        <tr><td>Accuracy to Given Constraints</td><td>30%</td></tr>
        <tr><td>Creativity & Innovation</td><td>20%</td></tr>
        <tr><td>Prompt Structure & Clarity</td><td>20%</td></tr>
        <tr><td>Technical Control</td><td>20%</td></tr>
        <tr><td>Output Cleanliness</td><td>10%</td></tr>
      </table>

      <h3>🌐 Round 2: Site Cloning</h3>
      <p><strong>Objective:</strong> Use prompt engineering techniques to recreate a given website layout using AI-assisted code generation tools. This is the final and most challenging round.</p>
      <ul>
        <li><strong>Team Type:</strong> 2 Members per team</li>
        <li><strong>Duration:</strong> 45–60 minutes</li>
        <li><strong>Platform:</strong> AI-assisted code generation tools (approved free tools only)</li>
        <li><strong>Type:</strong> Final Round</li>
      </ul>
      <p><em>*Only participants shortlisted from Round 1 are eligible to compete in this round.</em></p>
      
      <p><strong>Task Description:</strong> Participants will be provided with a live website URL and must recreate the website layout as accurately as possible using AI-generated prompts.</p>
      
      <p><strong>Challenge Requirements:</strong></p>
      <ul>
        <li>Recreate the visual layout of the website</li>
        <li>Ensure responsiveness (Desktop & Mobile view)</li>
        <li>Maintain proper section alignment</li>
        <li>Use clean and structured code</li>
        <li>Include functional elements such as buttons, navbar, and links (static functionality is sufficient)</li>
        <li>Technology stack: HTML + CSS Only (or HTML + CSS + minimal JS)</li>
      </ul>

      <p><strong>Prompt Rules:</strong></p>
      <ul>
        <li>Maximum word limit: 120 words</li>
        <li>Participants must submit the exact prompt used</li>
        <li>No external editing tools are allowed</li>
        <li>No use of paid AI tools</li>
        <li>Only approved free platforms may be used</li>
      </ul>

      <p><strong>Evaluation Criteria:</strong></p>
      <table style="width:100%; border-collapse: collapse; margin: 10px 0;">
        <tr><td>Visual Similarity to Original Website</td><td>30%</td></tr>
        <tr><td>Responsiveness</td><td>20%</td></tr>
        <tr><td>Code Structure & Cleanliness</td><td>20%</td></tr>
        <tr><td>Prompt Strategy & Clarity</td><td>20%</td></tr>
        <tr><td>Functional Accuracy</td><td>10%</td></tr>
      </table>

      <h3>👥 Student Coordinators</h3>
      <ul>
        <li><strong>Dinesh Kumar R</strong> (Head)</li>
        <li><strong>Archana</strong></li>
        <li><strong>Krishnakanth</strong></li>
      </ul>
    </div>`,
    date: 'Day 1',
    time: '10:00 AM',
    venue: 'Computer Lab 1',
    image: 'img/events-tech/1.webp',
    formLink: 'registration.html'
  },
  'speedcraft': {
    title: 'Debug Detective',
    desc: `<div class="event-full-desc">
      <p><strong>Debug-Detective</strong> is a technical puzzle hunt that challenges participants' logical thinking, coding skills, and problem-solving abilities. Teams act as digital detectives, solving clues, cracking puzzles, and debugging code to progress through each stage. The event combines logic puzzles, encrypted files, and programming challenges in a timed and competitive environment where speed, accuracy, and teamwork are essential.</p>
      
      <h3>👥 Team Structure & Rules</h3>
      <ul>
        <li><strong>Team Size:</strong> 2 members per team</li>
        <li><strong>Duration:</strong> 2 hours</li>
        <li><strong>No external help</strong> (Google, AI, books unless specified)</li>
        <li>Points awarded based on <strong>correctness & speed</strong></li>
        <li>Hints available with <strong>negative marking</strong></li>
      </ul>

      <h3>🎯 Challenge Types</h3>
      <p>All clues are based on technology and programming concepts and guide teams to the next challenge.</p>
      
      <table style="width:100%; border-collapse: collapse; margin: 10px 0;">
        <tr style="background: rgba(0, 240, 255, 0.1);">
          <td style="font-weight: 700; color: #00f0ff;">Challenge Type</td>
          <td style="font-weight: 700; color: #00f0ff;">Example</td>
          <td style="font-weight: 700; color: #00f0ff;">Outcome</td>
        </tr>
        <tr><td>ZIP File</td><td>Solve a riddle/puzzle to get the password</td><td>Unlocks zip file for Round 2; contains next set of puzzles</td></tr>
        <tr><td>Solve Puzzles</td><td>Mini-technical puzzles (logic, patterns, SQL queries)</td><td>Leads teams to the next clue</td></tr>
        <tr><td>Programming Puzzle</td><td>Debug a code snippet to reveal a message</td><td>Corrected code prints next clue or password part</td></tr>
      </table>

      <h3>📊 Scoring System</h3>
      
      <p><strong>Base Points & Speed Bonus:</strong></p>
      <table style="width:100%; border-collapse: collapse; margin: 10px 0;">
        <tr style="background: rgba(0, 240, 255, 0.1);">
          <td style="font-weight: 700; color: #00f0ff;">Challenge Type</td>
          <td style="font-weight: 700; color: #00f0ff;">Points</td>
          <td style="font-weight: 700; color: #00f0ff;">Speed Bonus</td>
          <td style="font-weight: 700; color: #00f0ff;">Hint Penalty</td>
        </tr>
        <tr><td>ZIP File</td><td>10 points</td><td>+5 points</td><td>-3 points/hint</td></tr>
        <tr><td>Solve Puzzles</td><td>10 points</td><td>+5 points</td><td>-3 points/hint</td></tr>
        <tr><td>Programming Puzzle</td><td>15 points</td><td>+7 points</td><td>-5 points/hint</td></tr>
      </table>
      <p><em>First team to finish the entire hunt gets an extra <strong>+20 bonus points</strong></em></p>

      <p><strong>Penalties & Deductions:</strong></p>
      <ul>
        <li>Requesting hints: -3 to -5 points per hint (varies by challenge)</li>
        <li>Skipping a checkpoint: -10 points per checkpoint</li>
        <li>Using unauthorized external help: <strong>Disqualification</strong></li>
        <li>Tampering with clues/checkpoints: <strong>Disqualification</strong></li>
      </ul>

      <h3>🏆 Prizes</h3>
      <ul>
        <li><strong>Winner:</strong> Highest total points - <strong>Rs. 2,000/-</strong></li>
        <li><strong>Runner-up:</strong> Second-highest scoring team - <strong>Rs. 1,000/-</strong></li>
      </ul>

      <p><strong>Tie-Breaker Rules:</strong></p>
      <ol>
        <li>Team that completes the debug in the shortest time</li>
        <li>If still tied, a sudden-death debugging question decides the winner</li>
      </ol>

      <h3>📍 Venue & Coordinators</h3>
      <p><strong>Venue:</strong> CC4 Lab</p>
      <p><strong>Staff Coordinator:</strong><br>
      Mr. B. Rajagopal - <a href="tel:+919159211743" style="color: #00f0ff;">9159211743</a></p>
      <p><strong>Student Coordinator:</strong><br>
      Ashwini CS - <a href="tel:+919659189110" style="color: #00f0ff;">9659189110</a></p>
    </div>`,
    date: 'Day 1',
    time: '10:00 AM',
    venue: 'CC4 Lab',
    image: 'img/events-tech/2.webp',
    formLink: 'registration.html'
  },
  'clonex': {
    title: 'Code Debugging',
    desc: `<div class="event-full-desc">
      <p><strong>Code Debugging</strong> is a competitive coding event where participants solve defects in given code to make it run correctly. This solo challenge tests your debugging skills, logical thinking, and ability to identify and fix code errors under time pressure.</p>
      
      <h3>👤 Team Structure & Rules</h3>
      <ul>
        <li><strong>Team Size:</strong> 1 member (Solo event)</li>
        <li><strong>Total Duration:</strong> 1 hour 30 minutes</li>
        <li><strong>No external help allowed</strong></li>
        <li>Solving each bug scores you a point</li>
      </ul>

      <h3>🎯 Round 1: Bug Fixing</h3>
      <ul>
        <li><strong>Duration:</strong> 20 minutes</li>
        <li><strong>Objective:</strong> Find all existing bugs and rectify the faults to make the code work</li>
        <li><strong>Round Type:</strong> Bug solving in the given code</li>
        <li><strong>Qualification:</strong> Participants scoring the required cutoff will advance to Round 2</li>
      </ul>

      <h3>🔄 Round 2: Code Rearrangement</h3>
      <ul>
        <li><strong>Round Type:</strong> Rearrange the jumbled code</li>
        <li><strong>Objective:</strong> Assemble all the scrambled lines and functions in the correct order to pass test cases</li>
        <li><strong>Challenge:</strong> Code structure and logic flow understanding</li>
      </ul>

      <h3>🏆 Winner Selection</h3>
      <p>Winners will be decided based on the <strong>combined score of both rounds</strong>.</p>
      <p><strong>Tie-Breaker:</strong> In case of a tie, the participant who completes the task in the <strong>least time</strong> will be ranked higher.</p>

      <h3>📜 Rules & Regulations</h3>
      <ul>
        <li>Use of mobile phones or internet is <strong>strictly prohibited</strong></li>
        <li>External help is not allowed</li>
        <li>Work must be individual and original</li>
        <li>Follow all time limits strictly</li>
        <li>Judges' decision will be final</li>
      </ul>

      <h3>📍 Venue & Timeline</h3>
      <p><strong>Venue:</strong> IT Lab</p>
      <p><strong>Timeline:</strong> 2:30 PM to 4:00 PM</p>
    </div>`,
    date: 'Day 1',
    time: '2:30 PM',
    venue: 'IT Lab',
    image: 'img/events-tech/3.webp',
    formLink: 'registration.html'
  },
  'reverseengg': {
    title: 'Leak the Logic',
    desc: `<div class="event-full-desc">
      <p><strong>Leak the Logic</strong> allows coders to work in different fields of coding, where they have to decrypt the problem statement and find the algorithmic logic behind it. All the rounds are inter-connected for the climax compilation.</p>
      
      <h3>👥 Team Structure & Rules</h3>
      <ul>
        <li><strong>Team Size:</strong> 2 members per team</li>
        <li><strong>Total Duration:</strong> 1 hour 30 minutes</li>
      </ul>

      <p><strong>Strict Rules:</strong></p>
      <ul>
        <li>Peeping into other's systems are <strong>strictly prohibited</strong></li>
        <li><strong>No tab switch allowed</strong></li>
      </ul>

      <h3>🎯 Round 1: Story-Based Word Problem</h3>
      <ul>
        <li><strong>Duration:</strong> 1 hour 10 minutes</li>
        <li><strong>Round Type:</strong> Story-based word problem</li>
      </ul>

      <p><strong>Objective:</strong></p>
      <ul>
        <li>Find the <strong>abstract</strong> behind each problem statement</li>
        <li>The resultant code must <strong>satisfy all given test cases</strong></li>
        <li>Each question contains a <strong>special codex</strong>, which can be used for the final question to end this game</li>
      </ul>

      <p><em>💡 All rounds are inter-connected, and each problem provides a special codex needed for the final climax question!</em></p>

      <h3>🏆 Winner Selection</h3>
      <p>Winners will be decided based on the <strong>combined score of all rounds</strong>.</p>
      <p><strong>Tie-Breaker:</strong> In case of a tie, the team that completes the task in the <strong>least time</strong> will be ranked higher.</p>

      <h3>📍 Venue & Timeline</h3>
      <p><strong>Venue:</strong> IT Lab</p>
      <p><strong>Timeline:</strong> 10:00 AM to 11:30 AM</p>
    </div>`,
    date: 'Day 1',
    time: '10:00 AM',
    venue: 'IT Lab',
    image: 'img/events-tech/4.webp',
    formLink: 'registration.html'
  },
  'circuitsurge': {
    title: 'Circuit Hunt',
    desc: 'Design and debug complex electronic circuits. Test your knowledge of electronics and circuit theory in this electrifying event.',
    date: 'Day 1',
    time: '12:00 Noon',
    venue: 'Circuits Lab',
    image: 'img/events-tech/5.webp',
    formLink: 'registration.html'
  },
  'kryptobyte': {
    title: 'Logic Matrix',
    desc: 'Solve cryptographic puzzles and crack codes. A challenge for cybersecurity enthusiasts and puzzle solvers.',
    date: 'Day 1',
    time: '12:00 Noon',
    venue: 'Cyber Security Lab',
    image: 'img/events-tech/6.webp',
    formLink: 'registration.html'
  },
  'roborush': {
    title: 'Circuit Surge 2.0',
    desc: `<div class="event-full-desc">
      <p><strong>CIRCUIT SURGE 2.0</strong> allows electrical enthusiasts to solve problems and showcase their knowledge, creativity, and innovation as they step ahead. Compete, learn, and electrify your future.</p>
      
      <h3>👥 Team Structure & Rules</h3>
      <ul>
        <li><strong>Team Size:</strong> 3 members per team</li>
        <li><strong>Total Duration:</strong> 3 hours</li>
        <li>No external help allowed</li>
        <li>Points awarded based on correctness</li>
      </ul>

      <h3>📋 Circuit Surge Rounds</h3>

      <p><strong>ROUND 1: Electrical Basics Quiz</strong></p>
      <ul>
        <li><strong>Duration:</strong> 20-25 minutes</li>
        <li><strong>Round Type:</strong> Quiz on basic electrical concepts</li>
        <li><strong>Objective:</strong> Evaluate basic problem-solving skills related to simple electrical circuits</li>
        <li><strong>Qualification:</strong> Teams scoring the required cutoff advance to Round 2</li>
      </ul>

      <p><strong>ROUND 2: Circuit Puzzle</strong></p>
      <ul>
        <li><strong>Objective:</strong> Assess the ability to identify correct circuit connections and components</li>
        <li><strong>Challenge:</strong> Solve circuit puzzles and identify proper component arrangements</li>
      </ul>

      <p><strong>ROUND 3: Circuit Building & Presentation</strong></p>
      <ul>
        <li><strong>Round Type:</strong> Circuit building and presentation</li>
        <li><strong>Objective:</strong> Assess both practical debugging skills and the ability to clearly explain circuit design, operation, and fault analysis</li>
        <li><strong>Focus:</strong> Hands-on circuit construction and technical communication</li>
      </ul>

      <h3>🏆 Winner Selection</h3>
      <p>Winners will be decided based on the <strong>combined score of all three rounds</strong>.</p>
      <p><strong>Tie-Breaker:</strong> In case of a tie, the team that completes the task in the <strong>least time</strong> will be ranked higher.</p>

      <h3>📜 Rules & Regulations</h3>
      <ul>
        <li>Use of mobile phones or internet is <strong>strictly prohibited</strong></li>
        <li>External help is not allowed</li>
        <li>Components should be handled <strong>carefully</strong></li>
        <li>Judges' decision will be <strong>final</strong></li>
      </ul>

      <h3>📍 Venue & Timeline</h3>
      <p><strong>Venue:</strong> PSS Lab</p>
      <p><strong>Timeline:</strong> 10:00 AM to 1:00 PM</p>
    </div>`,
    date: 'Day 1',
    time: '10:00 AM',
    venue: 'PSS Lab',
    image: 'img/events-tech/7.webp',
    formLink: 'registration.html'
  },
  'productpitch': {
    title: 'WATT HOURS – Energy Auditing',
    desc: `<div class="event-full-desc">
      <p><strong>WATT HOURS</strong> allows energy enthusiasts to solve problems and showcase their knowledge, creativity, and innovation as they step ahead. Compete, learn, and electrify your future by saving the nature.</p>
      
      <h3>👥 Team Structure & Rules</h3>
      <ul>
        <li><strong>Team Size:</strong> 2 to 4 members per team</li>
        <li><strong>Total Duration:</strong> 3 hours</li>
        <li>No external help allowed</li>
        <li>Points awarded based on correctness</li>
      </ul>

      <h3>📋 Energy Auditing Rounds</h3>

      <p><strong>ROUND 1: Preliminary Quiz Assessment</strong></p>
      <ul>
        <li><strong>Duration:</strong> 20 minutes</li>
        <li><strong>Focus:</strong> Energy auditing and management</li>
        <li><strong>Objective:</strong> Evaluate basic problem-solving skills related to simple energy savings</li>
        <li><strong>Qualification:</strong> Teams scoring the required cutoff advance to Round 2</li>
      </ul>

      <p><strong>ROUND 2: Field Work</strong></p>
      <p><strong>Objective:</strong></p>
      <ul>
        <li>Observe various energy usage in a particular area</li>
        <li>Calculate <strong>total demand per day</strong></li>
        <li>Calculate <strong>cost of unit consumption</strong></li>
        <li>Provide <strong>recommendations</strong> for implementing energy-efficient equipment to reduce energy consumption</li>
        <li><em>Location can be used as your willing</em></li>
      </ul>

      <p><strong>ROUND 3: Carbon Footprint Calculation & SDG Goals Mapping</strong></p>
      <ul>
        <li><strong>Round Type:</strong> Carbon footprint calculation and SDG goals mapping</li>
        <li><strong>Objective:</strong> Support strategies for reducing carbon emissions</li>
        <li>Map findings to relevant <strong>Sustainable Development Goals (SDGs)</strong></li>
      </ul>

      <h3>🏆 Winner Selection</h3>
      <p>Top teams will be shortlisted based on the <strong>combined score of all three rounds</strong>.</p>
      <p><strong>Tie-Breaker:</strong> In case of a tie, the team that completes the task in the <strong>least time</strong> will be ranked higher.</p>

      <h3>📜 Rules & Regulations</h3>
      <ul>
        <li>Use of mobile phones or internet is <strong>strictly prohibited</strong></li>
        <li>External help is not allowed</li>
        <li>Components should be handled <strong>carefully</strong></li>
        <li>Judges' decision will be <strong>final</strong></li>
      </ul>

      <h3>📍 Venue & Timeline</h3>
      <p><strong>Venue:</strong> PSS Lab</p>
      <p><strong>Timeline:</strong> 2:00 PM to 5:00 PM</p>
    </div>`,
    date: 'Day 2',
    time: '2:00 PM',
    venue: 'PSS Lab',
    image: 'img/events-tech/8.webp',
    formLink: 'registration.html'
  },
  'dasheddata': {
    title: 'THINKTANK – Scenario Showdown',
    desc: `<div class="event-full-desc">
      <p><strong>THINKTANK (ScenarioShowdown)</strong> is an engaging team-based competition designed to test your ability to analyze complex real-world situations and develop practical solutions. Through story-based scenarios, teams will tackle challenges involving business decisions, ethical dilemmas, crisis management, and strategic problem-solving. This is a <strong>non-technical event</strong> - it's about how you think, analyze, and make decisions as a team.</p>
      
      <p><em>💡 Key Highlight: Round 1 is an ELIMINATION round! Only top-performing teams advance to Round 2.</em></p>

      <h3>📋 Competition Structure</h3>
      
      <p><strong>ROUND 1: LOGICAL THINKING (ELIMINATION ROUND)</strong></p>
      <ul>
        <li><strong>Duration:</strong> 45 minutes</li>
        <li><strong>Number of Scenarios:</strong> 2 (teams must answer both)</li>
        <li><strong>Team Format:</strong> Collaborate and submit one response per team</li>
        <li><strong>Outcome:</strong> Top teams advance to Round 2</li>
        <li><strong>Focus Areas:</strong> Business decision-making, work-life scenarios, multi-stakeholder analysis</li>
      </ul>

      <p><strong>ROUND 2: CRITICAL THINKING (FINALS)</strong></p>
      <ul>
        <li><strong>Duration:</strong> 45 minutes</li>
        <li><strong>Number of Scenarios:</strong> 2 (teams must answer both)</li>
        <li><strong>Participants:</strong> Only qualified teams from Round 1</li>
        <li><strong>Focus Areas:</strong> Crisis management, ethical dilemmas, strategic problem-solving under constraints</li>
      </ul>

      <h3>⏰ Event Schedule</h3>
      <table style="width:100%; border-collapse: collapse; margin: 10px 0;">
        <tr style="background: rgba(0, 240, 255, 0.1);">
          <td style="font-weight: 700; color: #00f0ff;">Time</td>
          <td style="font-weight: 700; color: #00f0ff;">Activity</td>
          <td style="font-weight: 700; color: #00f0ff;">Duration</td>
        </tr>
        <tr><td>10:00 AM - 10:45 AM</td><td>🎯 ROUND 1: Logical Thinking (Elimination)</td><td>45 min</td></tr>
        <tr><td>10:45 AM - 11:00 AM</td><td>⏸️ Break + Evaluation + Results</td><td>15 min</td></tr>
        <tr><td>11:00 AM - 11:05 AM</td><td>📢 Announcement: Teams Advancing to Round 2</td><td>5 min</td></tr>
        <tr><td>11:05 AM - 11:50 AM</td><td>🎯 ROUND 2: Critical Thinking (Finals)</td><td>45 min</td></tr>
        <tr><td>11:50 AM - 12:45 PM</td><td>🍽️ Lunch Break (Final Evaluation)</td><td>55 min</td></tr>
        <tr><td>12:45 PM - 1:15 PM</td><td>🏆 Results Announcement & Prize Distribution</td><td>30 min</td></tr>
      </table>

      <h3>🏆 Prize Distribution</h3>
      <table style="width:100%; border-collapse: collapse; margin: 10px 0;">
        <tr style="background: rgba(0, 240, 255, 0.1);">
          <td style="font-weight: 700; color: #00f0ff;">Position</td>
          <td style="font-weight: 700; color: #00f0ff;">Prize Amount</td>
          <td style="font-weight: 700; color: #00f0ff;">Recognition</td>
        </tr>
        <tr><td>🥇 First Place</td><td><strong>₹3,000</strong></td><td>Certificate + Trophy</td></tr>
        <tr><td>🥈 Second Place</td><td><strong>₹2,000</strong></td><td>Certificate + Medal</td></tr>
        <tr><td>🥉 Third Place</td><td><strong>₹1,000</strong></td><td>Certificate + Medal</td></tr>
      </table>
      <p><em>Total Prize Pool: <strong>₹6,000</strong></em></p>

      <h3>📊 Judging Criteria</h3>
      <p>Each scenario is evaluated out of 100 points. Teams answer 2 scenarios per round.</p>
      <ul>
        <li>Round 1 (Elimination): 200 points maximum (2 scenarios × 100 points)</li>
        <li>Round 2 (Finals): 200 points maximum (2 scenarios × 100 points)</li>
        <li><strong>Maximum Total Score: 400 points</strong></li>
      </ul>

      <p><strong>Evaluation Criteria (Both Rounds):</strong></p>
      <table style="width:100%; border-collapse: collapse; margin: 10px 0;">
        <tr style="background: rgba(0, 240, 255, 0.1);">
          <td style="font-weight: 700; color: #00f0ff;">Criteria</td>
          <td style="font-weight: 700; color: #00f0ff;">Points</td>
        </tr>
        <tr><td>Problem Understanding</td><td>25</td></tr>
        <tr><td>Analytical Reasoning</td><td>30</td></tr>
        <tr><td>Multi-perspective Analysis</td><td>25</td></tr>
        <tr><td>Solution Quality & Justification</td><td>20</td></tr>
      </table>

      <h3>👥 Team Guidelines</h3>
      <p><strong>Team Composition:</strong></p>
      <ul>
        <li>Each team works together on all scenarios</li>
        <li>Submit ONE response document per team</li>
        <li>All team members contribute to discussion and writing</li>
      </ul>

      <p><strong>Response Format:</strong></p>
      <ul>
        <li>Submit as Word document (.docx)</li>
        <li>Recommended length: 200-300 words per scenario</li>
        <li>Write in clear, organized paragraphs</li>
        <li>Label each response clearly (Scenario 1, Scenario 2)</li>
      </ul>

      <p><strong>Time Management:</strong></p>
      <ul>
        <li>45 minutes for 2 scenarios = ~22 minutes per scenario</li>
        <li>Spend 3-5 minutes reading and discussing as a team</li>
        <li>Allocate 15-17 minutes for writing each response</li>
        <li>Reserve 3 minutes at the end for review</li>
      </ul>

      <h3>📜 Rules and Regulations</h3>
      <ul>
        <li>Teams must answer BOTH scenarios in each round</li>
        <li>No internet, books, or external resources during competition</li>
        <li>All work must be original - plagiarism leads to disqualification</li>
        <li>Submit documents immediately when time is called</li>
        <li>Late submissions will not be accepted</li>
        <li>Only qualified teams from Round 1 can participate in Round 2</li>
        <li>Judges' decisions are final and binding</li>
        <li>Teams must be present at prize distribution to claim prizes</li>
      </ul>

      <h3>📞 Contact Information</h3>
      <p><strong>Event Coordinator:</strong> Senthoor Balan<br>
      Email: <a href="mailto:Senthoor.2302144@sritcbe.ac.in" style="color: #00f0ff;">Senthoor.2302144@sritcbe.ac.in</a><br>
      Phone: <a href="tel:+917373077820" style="color: #00f0ff;">+91 7373077820</a></p>
    </div>`,
    date: 'Day 2',
    time: '10:00 AM',
    venue: 'Data Science Lab',
    image: 'img/events-nontech/9.webp',
    formLink: 'registration.html'
  },
  'flyforge': {
    title: 'IPL Auction',
    desc: `<div class="event-full-desc">
      <p><strong>IPL Auction</strong> is an exciting and interactive non-technical event designed to simulate the real player auction system used in professional cricket leagues. Participants act as franchise owners and strategically bid for players within a fixed budget.</p>
      
      <h3>👥 Team Structure & Rules</h3>
      <ul>
        <li><strong>Team Size:</strong> 4 members per team</li>
        <li><strong>Duration:</strong> 1 hour</li>
      </ul>

      <h3>🎮 Gameplay Format</h3>
      <ol>
        <li>Decide the team with 4 members</li>
        <li>Each team will have a <strong>fixed purse amount</strong></li>
        <li>Cricket players will be auctioned with a <strong>fixed base price</strong></li>
        <li>Each player has a <strong>hidden play rate</strong> based on performance</li>
        <li><strong>Maximum bid</strong> will hold the player</li>
        <li>Finally, the team with the <strong>greater play rate</strong> and a <strong>balanced team</strong> wins the prize</li>
      </ol>
      <p><em>The final judgment will be given by the judges and there will be no arguments with judges.</em></p>

      <h3>🏆 Winner Selection</h3>
      <p>The winning team will be determined based on:</p>
      <ul>
        <li><strong>Total team rating</strong> (sum of player points), OR</li>
        <li><strong>Best balanced squad</strong> (based on predefined player scores), OR</li>
        <li><strong>Maximum total points</strong> calculated after squad completion</li>
      </ul>

      <h3>📜 Rules & Regulations</h3>
      <ul>
        <li>Each team will be given a <strong>fixed virtual purse amount</strong></li>
        <li>Each player will have a <strong>base price</strong></li>
        <li>Bidding must increase in <strong>fixed increments</strong> (e.g., ₹500 coins)</li>
        <li>The timer (<strong>15–30 seconds</strong>) will run for each player</li>
        <li>The <strong>highest bidder</strong> at the end of the timer wins the player</li>
        <li>A team <strong>cannot bid beyond</strong> their remaining purse amount</li>
        <li>If no bids are placed, the player will be declared <strong>"Unsold"</strong></li>
        <li>Once sold, the amount will be <strong>deducted</strong> from the winning team's purse</li>
        <li>The decision of the event coordinator/judges will be <strong>final</strong></li>
      </ul>

      <h3>📍 Venue & Timeline</h3>
      <p><strong>Venue:</strong> 2nd Year Classroom</p>
      <p><strong>Timeline:</strong> 12:00 PM to 1:00 PM</p>
    </div>`,
    date: 'Day 2',
    time: '12:00 PM',
    venue: '2nd Year Classroom',
    image: 'img/events-nontech/10.webp',
    formLink: 'registration.html'
  },
  'codewar': {
    title: 'Tech Quiz',
    desc: `<div class="event-full-desc">
      <p><strong>Tech Quiz</strong> is a competitive technical event designed to evaluate participants' knowledge, logical thinking, problem-solving ability, and speed in engineering and technology-related subjects. Unlike written exams, a tech quiz is interactive, engaging, and application-oriented.</p>
      
      <h3>👥 Team Structure & Rules</h3>
      <ul>
        <li><strong>Team Size:</strong> Maximum 2 members</li>
        <li><strong>Duration:</strong> 2 hours</li>
        <li>Open to undergraduate and postgraduate students</li>
        <li>Teams must complete registration before the scheduled start time</li>
        <li>Late entries will not be allowed under any circumstances</li>
      </ul>

      <h3>📋 Quiz Format - 3 Rounds</h3>
      
      <p><strong>ROUND 1: Preliminary / MCQ Round</strong></p>
      <ul>
        <li><strong>Format:</strong> All teams participate simultaneously</li>
        <li><strong>Questions:</strong> 30 MCQ questions (distributed through printed sheets)</li>
        <li><strong>Scoring:</strong> +1 for correct answer, 0 for wrong answer</li>
        <li><strong>Qualification:</strong> Selected teams advance based on scores</li>
      </ul>

      <p><strong>ROUND 2: Technical / Logical Round</strong></p>
      <ul>
        <li><strong>Format:</strong> Logical problems, code debugging, or output prediction</li>
        <li><strong>Questions:</strong> 20 questions</li>
        <li><strong>Scoring:</strong> +5 for correct answer, -2.5 for wrong answer</li>
        <li><strong>Focus:</strong> Accuracy and speed are considered for scoring</li>
      </ul>

      <p><strong>ROUND 3: Circuit / Image Based Round</strong></p>
      <ul>
        <li><strong>Format:</strong> Questions based on circuit diagrams, waveforms, or block diagrams</li>
        <li><strong>Questions:</strong> 20 questions</li>
        <li><strong>Scoring:</strong> +10 for correct answer, -5 for wrong answer</li>
        <li><strong>Objective:</strong> Teams analyze and answer within the allotted time</li>
      </ul>

      <h3>🏆 Winner Selection</h3>
      <p>The team with the <strong>most points</strong> at the end of all three rounds will be declared the winner.</p>
      
      <p><strong>Tie-Breaker:</strong> In case of equal scores, a tie-breaker round with rapid-fire questions is conducted. The team answering first correctly is declared the winner.</p>

      <h3>💰 Prize Distribution</h3>
      <table style="width:100%; border-collapse: collapse; margin: 10px 0;">
        <tr style="background: rgba(0, 240, 255, 0.1);">
          <td style="font-weight: 700; color: #00f0ff;">Position</td>
          <td style="font-weight: 700; color: #00f0ff;">Prize Amount</td>
          <td style="font-weight: 700; color: #00f0ff;">Recognition</td>
        </tr>
        <tr><td>🥇 Winner</td><td><strong>₹1,000</strong></td><td>Certificate + Cash Prize</td></tr>
        <tr><td>🥈 Runner-up</td><td><strong>₹500</strong></td><td>Certificate + Cash Prize</td></tr>
        <tr><td>🎖️ All Participants</td><td>—</td><td>Participation Certificate</td></tr>
      </table>

      <h3>📜 Rules & Regulations</h3>
      <ul>
        <li>The quiz will be conducted in multiple rounds</li>
        <li>The number of rounds and format may vary based on time availability</li>
        <li>Elimination rounds may be conducted if the number of teams is high</li>
        <li>Teams must answer within the given time; <strong>no extra time</strong> will be provided</li>
        <li>Use of mobile phones, smart watches, internet, or any external resources is <strong>strictly prohibited</strong></li>
        <li>Any form of malpractice or misconduct will lead to <strong>immediate disqualification</strong></li>
        <li>Judges' decision will be <strong>final and binding</strong></li>
      </ul>

      <h3>📍 Venue & Timeline</h3>
      <p><strong>Venue:</strong> TBD</p>
      <p><strong>Timeline:</strong> 12:00 Noon (Day 2)</p>

      <h3>📞 Contact Information</h3>
      <p><strong>Event Coordinator:</strong> Aswin Rio.R<br>
      Phone: <a href="tel:+918270893039" style="color: #00f0ff;">+91 8270893039</a></p>
    </div>`,
    date: 'Day 2',
    time: '12:00 Noon',
    venue: 'TBD',
    image: 'img/events-nontech/11.webp',
    formLink: 'registration.html'
  },

  // Non-Technical Events
  'capturetheflag': {
    title: 'robothon',
    desc: 'Capture the Flag (CTF) competition. Find hidden flags in vulnerable systems and prove your hacking skills.',
    date: 'Day 1',
    time: '2:30 PM',
    venue: 'Cyber Security Lab',
    image: 'img/events-nontech/12.webp',
    formLink: 'registration.html'
  },
  'bestmanager': {
    title: 'BEST MANAGER',
    desc: 'Test your leadership and management skills. Handle stress, make quick decisions, and prove you have what it takes to lead.',
    date: 'Day 1',
    time: '2:30 PM',
    venue: 'Management Hall',
    image: 'img/events-nontech/ECE.webp',
    formLink: 'registration.html'
  },
  'quizzy': {
    title: 'QUIZZY',
    desc: 'A general knowledge quiz covering tech, pop culture, and current affairs. Buzzer rounds and rapid fires await the sharpest minds.',
    date: 'Day 1',
    time: '3:30 PM',
    venue: 'Auditorium',
    image: 'img/events-nontech/IT (2).webp',
    formLink: 'registration.html'
  },
  'promptpallette': {
    title: 'PROMPT PALLETTE',
    desc: 'A creative AI art generation contest. Use prompt engineering to generate the most stunning and accurate images based on themes.',
    date: 'Day 2',
    time: '2:30 PM',
    venue: 'Digital Lab',
    image: 'img/events-nontech/CSE.webp',
    formLink: 'registration.html'
  },
  'bidsmash': {
    title: 'BID SMASH',
    desc: 'A mock IPL auction! Manage your budget, bid strategically for players, and build the strongest team possible.',
    date: 'Day 2',
    time: '2:30 PM',
    venue: 'Seminar Hall 2',
    image: 'img/events-nontech/IT.webp',
    formLink: 'registration.html'
  },
  'mrtoolman': {
    title: 'MR TOOL MAN',
    desc: 'Identify tools and mechanical components correctly. A fun challenge for those who know their way around a workshop.',
    date: 'Day 2',
    time: '3:30 PM',
    venue: 'Workshop',
    image: 'img/events-nontech/MECH.webp',
    formLink: 'registration.html'
  },
  'circuitsurge': {
    title: 'Circuit Hunt',
    desc: `<div class="event-full-desc">
      <h3>🔍 Circuit Debugging Challenge</h3>
      <p><strong>Circuit Hunt</strong> is designed to test participants' basic electronics knowledge, logical thinking, and practical circuit debugging skills through two progressive rounds: paper-based circuit analysis and hands-on breadboard debugging.</p>
      
      <h3>👥 Team Structure & Rules</h3>
      <ul>
        <li><strong>Team Size:</strong> 3 members per team</li>
        <li><strong>Total Duration:</strong> 2 hours</li>
        <li>No external help allowed</li>
        <li>Points awarded based on correctness and speed</li>
        <li>Hints will be provided if needed, but with negative marks</li>
      </ul>

      <h3>📋 Event Rounds</h3>
      
      <p><strong>ROUND 1: Think Before You Build - Paper Circuit Debugging</strong></p>
      <ul>
        <li><strong>Round Type:</strong> Paper-based circuit analysis & debugging</li>
        <li><strong>Duration:</strong> 20-25 minutes</li>
        <li><strong>Objective:</strong> Participants will be provided with a faulty circuit diagram on paper consisting of basic electronic components (resistors, LEDs, diodes, transistors, ICs, logic gates)</li>
      </ul>

      <p><strong>Tasks:</strong></p>
      <ul>
        <li>Identify the errors in the given circuit</li>
        <li>Mention the reason for each error</li>
        <li>Redraw the correct circuit diagram</li>
      </ul>

      <p><strong>Common Errors to Look For:</strong></p>
      <ul>
        <li>Wrong polarity of LED or diode</li>
        <li>Missing ground or power supply</li>
        <li>Incorrect resistor value</li>
        <li>Short circuit or open circuit</li>
        <li>Wrong IC pin connection</li>
      </ul>

      <p><strong>Evaluation Criteria:</strong></p>
      <ul>
        <li>Accuracy in identifying errors</li>
        <li>Correct explanation of faults</li>
        <li>Proper redrawn circuit diagram</li>
      </ul>

      <p><em>Teams scoring the required cutoff will qualify for Round 2.</em></p>

      <p><strong>ROUND 2: Build – Break – Fix - Breadboard Circuit Debugging</strong></p>
      <ul>
        <li><strong>Objective:</strong> Qualified teams will be given a pre-connected faulty circuit on a breadboard that will not function initially due to intentional faults</li>
      </ul>

      <p><strong>Components Provided:</strong></p>
      <ul>
        <li>Breadboard</li>
        <li>Power supply / Battery</li>
        <li>Resistors, LEDs</li>
        <li>ICs / Transistors</li>
        <li>Connecting wires</li>
      </ul>

      <p><strong>Tasks:</strong></p>
      <ul>
        <li>Analyze the circuit behavior</li>
        <li>Identify the fault in the circuit</li>
        <li>Correct the breadboard connections</li>
        <li>Demonstrate the correct output to the judge</li>
      </ul>

      <p><strong>Possible Faults:</strong></p>
      <ul>
        <li>Loose or incorrect wire connections</li>
        <li>Wrong IC orientation</li>
        <li>Missing ground or power</li>
        <li>Wrong component placement</li>
      </ul>

      <p><strong>Evaluation Criteria:</strong></p>
      <ul>
        <li>Fault identification accuracy</li>
        <li>Correct debugging approach</li>
        <li>Successful output demonstration</li>
        <li>Time efficiency</li>
      </ul>

      <h3>🏆 Winner Selection</h3>
      <p>Winners will be decided based on the <strong>combined score of both rounds</strong>.</p>
      <p><strong>Tie-Breaker:</strong> In case of a tie, the team that completes the task in the <strong>least time</strong> will be ranked higher.</p>

      <h3>📜 Rules & Regulations</h3>
      <ul>
        <li>Use of mobile phones or internet is <strong>strictly prohibited</strong></li>
        <li>External help is not allowed</li>
        <li>Components should be handled <strong>carefully</strong></li>
        <li>Hints available with negative marks</li>
        <li>Judges' decision will be <strong>final</strong></li>
      </ul>

      <h3>📍 Venue & Timeline</h3>
      <p><strong>Venue:</strong> Circuits Lab</p>
      <p><strong>Time:</strong> 12:00 Noon (Day 1)</p>
      <p><strong>Duration:</strong> 2 hours</p>

      <p><em>This event provides an excellent opportunity to test and enhance your practical circuit debugging and analytical skills in both theoretical and hands-on environments.</em></p>
    </div>`,
    date: 'Day 1',
    time: '12:00 Noon',
    venue: 'Circuits Lab',
    image: 'img/events-tech/5.webp',
    formLink: 'registration.html'
  },

  // Workshops
  'genai': {
    title: 'IoT Design Workshop',
    desc: `<div class="event-full-desc">
      <h3>🔧 Hands-on Workshop on Internet of Things (IoT) Design</h3>
      <p><strong>IoT Design Workshop</strong> introduces students to the fundamentals of IoT design. It provides hands-on experience with real-time IoT hardware tools and bridges the gap between theoretical knowledge and practical implementation.</p>
      
      <h3>📍 Venue</h3>
      <p><strong>Centre Of Excellence Of IOT [COE]</strong></p>

      <h3>📋 Workshop Agenda</h3>
      
      <p><strong>Session 1: Inauguration & Introduction (10:00 – 10:30 AM)</strong></p>
      <ul>
        <li>Welcome address</li>
        <li>Overview of the workshop</li>
        <li>Importance of IoT in modern technology</li>
        <li>Safety instructions and lab guidelines</li>
      </ul>

      <p><strong>Session 2: Introduction to IoT (10:30 – 11:15 AM)</strong></p>
      <ul>
        <li>What is Internet of Things (IoT)?</li>
        <li>IoT architecture and components</li>
        <li>Overview of sensors, actuators, and controllers</li>
        <li>Overview of IoT boards (Arduino, NodeMCU / ESP32)</li>
        <li>Real-time IoT applications</li>
      </ul>

      <p><strong>☕ Tea Break (11:15 AM – 11:30 AM)</strong></p>

      <p><strong>Session 3: IoT Hands-on Training (11:30 AM – 12:30 PM)</strong></p>
      <ul>
        <li>Introduction to Arduino IDE</li>
        <li>Pin configuration and board setup</li>
        <li>Interfacing components (LED, Temperature / IR / Gas sensor)</li>
        <li>Writing and uploading basic IoT programs</li>
        <li>Monitoring output using Serial Monitor</li>
      </ul>

      <p><strong>Session 4: PCB Design Fundamentals (12:30 – 1:00 PM)</strong></p>
      <ul>
        <li>Building a simple IoT project</li>
        <li>Data visualization basics</li>
        <li>Troubleshooting and best practices</li>
        <li>Career opportunities in IoT</li>
      </ul>

      <h3>💡 What You'll Learn</h3>
      <ul>
        <li>Fundamentals of IoT design and architecture</li>
        <li>Hands-on experience with real-time IoT hardware tools</li>
        <li>Programming IoT boards (Arduino, NodeMCU/ESP32)</li>
        <li>Sensor interfacing and component integration</li>
        <li>PCB design basics for IoT projects</li>
        <li>Practical implementation skills</li>
      </ul>

      <h3>🎯 Key Highlights</h3>
      <ul>
        <li>Expert-led hands-on training sessions</li>
        <li>Real-time IoT hardware tools experience</li>
        <li>Practical project building</li>
        <li>Bridge between theory and implementation</li>
        <li>Industry-relevant skills development</li>
      </ul>

      <h3>⏰ Workshop Details</h3>
      <p><strong>Date:</strong> Day 1</p>
      <p><strong>Time:</strong> 10:00 AM – 1:00 PM</p>
      <p><strong>Duration:</strong> 3 hours (with tea break)</p>
      <p><strong>Venue:</strong> Centre Of Excellence Of IOT [COE]</p>

      <p><em>This workshop provides an excellent opportunity to gain practical IoT skills that are highly valued in today's technology-driven industry.</em></p>
    </div>`,
    date: 'Day 1',
    time: '10:00 AM - 1:00 PM',
    venue: 'Centre Of Excellence Of IOT [COE]',
    image: 'img/workshop/14.webp',
    formLink: 'workshop_registration.html'
  },
  'evehicle': {
    title: 'E-VEHICLE WORKSHOP',
    desc: 'Explore the future of mobility with hands-on EV tech workshops, live demos, and insights from industry pioneers!',
    date: 'Day 1',
    time: 'Full Day',
    venue: 'Power Lab',
    image: 'img/workshop/EEE.webp',
    formLink: 'workshop_registration.html'
  },
  'cloudcraft': {
    title: 'PLC Automation with IOT',
    desc: `<div class="event-full-desc">
      <p><strong>PLC Automation with IOT</strong> workshop is designed to provide participants with a comprehensive understanding of Programmable Logic Controllers (PLC) and their critical role in modern industrial automation systems.</p>
      
      <h3>🎯 Workshop Objectives</h3>
      <p>The objective of this workshop is to understand the fundamentals of PLC and its role in industrial automation. It aims to provide hands-on experience in PLC programming, wiring, and troubleshooting for real-time industrial applications.</p>

      <h3>📚 Topics Covered</h3>
      
      <p><strong>LADDER LOGIC</strong></p>
      <ul>
        <li>Develop skills in creating logic for industrial applications</li>
        <li>Motor control programming</li>
        <li>Timers and counters implementation</li>
        <li>Sequencing operations</li>
        <li>Real-time industrial application development</li>
      </ul>

      <p><strong>HMI (Human Machine Interface)</strong></p>
      <ul>
        <li>Study how HMI communicates with PLC</li>
        <li>Monitor industrial processes</li>
        <li>Control industrial processes through HMI</li>
        <li>Interface design and implementation</li>
      </ul>

      <p><strong>DRIVE CONTROL</strong></p>
      <ul>
        <li>Learn how to start and stop motors using PLC programming</li>
        <li>Vary motor speed through PLC control</li>
        <li>Reverse motor direction</li>
        <li>Advanced motor control techniques</li>
      </ul>

      <h3>💡 Key Learning Outcomes</h3>
      <ul>
        <li>Hands-on PLC programming experience</li>
        <li>PLC wiring and troubleshooting skills</li>
        <li>Understanding of industrial automation systems</li>
        <li>Real-time application development</li>
        <li>Integration of PLC with IOT systems</li>
      </ul>

      <h3>📍 Venue & Timeline</h3>
      <p><strong>Venue:</strong> COE(EV)</p>
      <p><strong>Time:</strong> 10:00 AM to 1:00 PM</p>
      <p><strong>Date:</strong> Day 2</p>

      <h3>👥 Who Should Attend</h3>
      <ul>
        <li>Engineering students interested in industrial automation</li>
        <li>Those interested in PLC programming and control systems</li>
        <li>Students looking to gain practical experience in industrial applications</li>
        <li>Anyone interested in IOT integration with industrial systems</li>
      </ul>

      <p><em>This workshop provides valuable hands-on experience that bridges theoretical knowledge with real-world industrial automation applications.</em></p>
    </div>`,
    date: 'Day 2',
    time: '10:00 AM - 1:00 PM',
    venue: 'COE(EV)',
    image: 'img/workshop/15.webp',
    formLink: 'workshop_registration.html'
  },
  'pcbbuild': {
    title: 'PCB BUILD',
    desc: 'Learn PCB design fundamentals and assemble your own boards with expert guidance!',
    date: 'Day 2',
    time: 'Full Day',
    venue: 'Electronics Lab',
    image: 'img/workshop/ECE.webp',
    formLink: 'workshop_registration.html'
  },

  // Cultural Events
  'visualvignetic': {
    title: 'VISUAL VIGNETIC',
    desc: 'Express your creativity through visual storytelling. A competition for short films, photography, and visual arts.',
    date: 'Day 2',
    time: '10:00 AM',
    venue: 'Auditorium',
    image: 'img/culturls/7.webp',
    formLink: 'cultural_registration.html'
  },
  'clipcounter': {
    title: 'CLIP COUNTER',
    desc: 'Test your observation and memory skills. Watch clips and answer questions based on details you spotted.',
    date: 'Day 2',
    time: '10:00 AM',
    venue: 'Seminar Hall',
    image: 'img/culturls/8.webp',
    formLink: 'cultural_registration.html'
  },
  'pixelperfect': {
    title: 'PIXEL PERFECT',
    desc: 'Digital art competition. Create stunning digital illustrations and designs that are pixel perfect.',
    date: 'Day 2',
    time: '10:00 AM',
    venue: 'Digital Lab',
    image: 'img/culturls/9.webp',
    formLink: 'cultural_registration.html'
  },
  'faceartistry': {
    title: 'FACE ARTISTRY',
    desc: 'Transform faces into living canvases. Show off your makeup and face painting skills in this artistic event.',
    date: 'Day 2',
    time: '10:00 AM',
    venue: 'Open Stage',
    image: 'img/culturls/10.webp',
    formLink: 'cultural_registration.html'
  },
  'hennaink': {
    title: 'HENNA INK',
    desc: 'The traditional art of Mehendi. Create intricate and beautiful designs to win the title of Henna Artist.',
    date: 'Day 2',
    time: '10:00 AM',
    venue: 'Courtyard',
    image: 'img/culturls/11.webp',
    formLink: 'cultural_registration.html'
  },
  'pencilplay': {
    title: 'PENCIL PLAY',
    desc: 'Sketch your imagination. A pencil sketching competition to showcase your shading and drawing techniques.',
    date: 'Day 2',
    time: '10:00 AM',
    venue: 'Drawing Hall',
    image: 'img/culturls/12.webp',
    formLink: 'cultural_registration.html'
  },
  'logicalrivera': {
    title: 'LOGICAL RIVERA',
    desc: 'Flow with logic in this puzzle-solving event. Navigate through riddles and brain teasers to reach the solution.',
    date: 'Day 2',
    time: '11:30 AM',
    venue: 'Classroom Block',
    image: 'img/culturls/13.webp',
    formLink: 'cultural_registration.html'
  },
  'mysticchase': {
    title: 'MYSTIC CHASE',
    desc: 'Chase the mystery and uncover the truth. A thrilling scavenger hunt full of suspense and clues.',
    date: 'Day 2',
    time: '11:30 AM',
    venue: 'Campus Wide',
    image: 'img/culturls/14.webp',
    formLink: 'cultural_registration.html'
  },
  'solelymelodia': {
    title: 'SOLELY MELODIA',
    desc: 'Solo singing competition. Captivate the audience with your voice and musical talent.',
    date: 'Day 2',
    time: '2:00 PM',
    venue: 'Main Auditorium',
    image: 'img/culturls/6.webp',
    formLink: 'cultural_registration.html'
  },
  'artofone': {
    title: 'ART OF ONE',
    desc: 'A unique solo showcase. Perform any talent - dance, acting, mime - and own the stage.',
    date: 'Day 2',
    time: '3:00 PM',
    venue: 'Open Auditorium',
    image: 'img/culturls/4.webp',
    formLink: 'cultural_registration.html'
  },
  'tunemorph': {
    title: 'TUNE MORPH',
    desc: 'Remix and exact. showcase your ability to morph tunes and create new musical vibes.',
    date: 'Day 2',
    time: '3:30 PM',
    venue: 'Music Hall',
    image: 'img/culturls/5.webp',
    formLink: 'cultural_registration.html'
  },
  'rythmicmotion': {
    title: 'RYTHMIC MOTION',
    desc: 'Group or solo dance competition. Set the stage on fire with your moves and rhythm.',
    date: 'Day 2',
    time: '4:00 PM',
    venue: 'Main Auditorium',
    image: 'img/culturls/3.webp',
    formLink: 'cultural_registration.html'
  }
};

function openEventModal(eventId) {
  const event = eventDetails[eventId];
  if (!event) {
    console.error('Event not found:', eventId);
    return;
  }

  // Populate Modal content
  document.getElementById('modalEventTitle').innerText = event.title;
  document.getElementById('modalEventDesc').innerHTML = event.desc; // Changed to innerHTML to support HTML content
  document.getElementById('modalEventDate').innerText = event.date;
  document.getElementById('modalEventTime').innerText = event.time;
  document.getElementById('modalEventVenue').innerText = event.venue;
  document.getElementById('modalEventImage').src = event.image;

  // Update Register Button Link
  const registerBtn = document.querySelector('.event-modal-left .register-btn');
  if (registerBtn) registerBtn.href = event.formLink;

  // Show Modal
  const modal = document.getElementById('eventModal');
  modal.style.display = 'flex';
  // Small timeout to allow display:flex to apply before adding opacity class
  setTimeout(() => {
    modal.classList.add('open');
  }, 10);

  document.body.style.overflow = 'hidden'; // Disable background scroll

  // Close when clicking outside content (overlay)
  modal.onclick = function (e) {
    if (e.target === modal) {
      closeEventModal();
    }
  }
}

function closeEventModal() {
  const modal = document.getElementById('eventModal');
  modal.classList.remove('open');

  // Wait for transition to finish before hiding
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Enable background scroll
  }, 300);
}

// Attach closing to Escape key
document.addEventListener('keydown', function (event) {
  if (event.key === "Escape") {
    closeEventModal();
  }
});


/* ==========================================================================
   AUDIO MANAGER (REFACTORED & STABLE)
   ========================================================================== */
/**
 * AudioManager handles all site-wide audio logic.
 * Features:
 * - Persistent state via localStorage.
 * - Browser autoplay policy handling (Unlock on interaction).
 * - Section-based audio switching (IntersectionObserver).
 * - Code-based volume management (No UI).
 */
class AudioManager {
  constructor() {
    // DOM Elements
    this.bgMusic = document.getElementById('bg-music');
    this.countdownAudio = document.getElementById('countdown-audio');
    this.introVideo = document.getElementById('bg-video');
    this.toggleBtn = document.getElementById('sound-toggle');

    // State
    this.soundEnabled = localStorage.getItem('vihansa_sound_enabled') === 'true';
    this.isUnlocked = false;
    this.activeSection = 'intro'; // Start assuming intro

    // ============================================
    // VOLUME SETTINGS (CONTROL HERE)
    // ============================================
    this.volumes = {
      music: 0.1,  // Background music volume (0.0 to 1.0)
      intro: 0.4,  // Intro video volume (0.0 to 1.0)
      timer: 0.5   // Countdown timer volume (0.0 to 1.0)
    };
    // ============================================

    if (this.toggleBtn) {
      this.init();
    }
  }

  init() {
    console.log("AudioManager: Initializing...");

    // 1. Set Initial UI State
    this.updateIcon();

    // 2. Setup Toggle Button (Mute/Unmute Global)
    this.toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleSound();
    });

    // 3. Setup Global Unlock Listener
    const unlockHandler = () => {
      console.log("AudioManager: User interaction detected. Unlocking audio.");
      this.isUnlocked = true;
      if (this.soundEnabled) {
        this.resumeAudioContexts();
      }
      ['click', 'keydown', 'touchstart'].forEach(evt =>
        document.removeEventListener(evt, unlockHandler)
      );
    };

    ['click', 'keydown', 'touchstart'].forEach(evt =>
      document.addEventListener(evt, unlockHandler)
    );

    // 4. Setup Visibility Handler
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.muteAll(true);
      } else {
        if (this.soundEnabled) {
          this.resumeAudioContexts();
        }
      }
    });

    // 5. Setup Intersection Observer
    this.setupObservers();

    // 6. Initial Configuration
    this.configureElements();

    // 7. Attempt Auto-Start
    if (this.soundEnabled) {
      this.resumeAudioContexts();
    }
  }

  initVolumeControls() {
    // Initialize slider values
    if (this.volSliderMusic) this.volSliderMusic.value = this.volumes.music;
    if (this.volSliderIntro) this.volSliderIntro.value = this.volumes.intro;
    if (this.volSliderTimer) this.volSliderTimer.value = this.volumes.timer;

    // Bind events
    if (this.volSliderMusic) {
      this.volSliderMusic.addEventListener('input', (e) => {
        this.volumes.music = parseFloat(e.target.value);
        if (this.bgMusic) this.bgMusic.volume = this.volumes.music;
      });
    }

    if (this.volSliderIntro) {
      this.volSliderIntro.addEventListener('input', (e) => {
        this.volumes.intro = parseFloat(e.target.value);
        if (this.introVideo && !this.introVideo.muted) this.introVideo.volume = this.volumes.intro;
      });
    }

    if (this.volSliderTimer) {
      this.volSliderTimer.addEventListener('input', (e) => {
        this.volumes.timer = parseFloat(e.target.value);
        if (this.countdownAudio) this.countdownAudio.volume = this.volumes.timer;
      });
    }
  }

  configureElements() {
    if (this.bgMusic) {
      this.bgMusic.loop = true;
      this.bgMusic.volume = this.volumes.music;
    }
    if (this.countdownAudio) {
      this.countdownAudio.loop = true;
      this.countdownAudio.volume = this.volumes.timer;
    }
    if (this.introVideo) {
      this.introVideo.loop = true;
      this.introVideo.muted = true; // Start muted
      this.introVideo.volume = this.volumes.intro;

      this.introVideo.addEventListener('canplay', () => {
        this.introVideo.play().catch(e => console.warn("Video visual play failed:", e));
      }, { once: true });
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('vihansa_sound_enabled', this.soundEnabled);
    console.log(`AudioManager: Sound toggled to ${this.soundEnabled}`);
    this.updateIcon();

    if (this.soundEnabled) {
      this.isUnlocked = true;
      this.resumeAudioContexts();
    } else {
      this.stopAll();
    }
  }

  updateIcon() {
    if (this.soundEnabled) {
      this.toggleBtn.textContent = '🔊';
      this.toggleBtn.style.opacity = '1';
    } else {
      this.toggleBtn.textContent = '🔇';
      this.toggleBtn.style.opacity = '0.7';
    }
  }

  updatePlaybackState() {
    if (!this.soundEnabled) return;

    console.log(`AudioManager: Updating playback for section '${this.activeSection}'`);

    // 1. Background Music: Always plays if enabled
    this.playAudio(this.bgMusic, this.volumes.music);

    // 2. Section Specific Audio
    if (this.activeSection === 'intro') {
      // Intro: Video Audio ON, Countdown OFF
      if (this.introVideo) {
        this.introVideo.muted = false;
        this.introVideo.volume = this.volumes.intro;
      }
      this.pauseAudio(this.countdownAudio);

    } else if (this.activeSection === 'about') {
      // About/Countdown: Video Audio OFF, Countdown ON
      if (this.introVideo) this.introVideo.muted = true; // Mute video but keep playing visually
      this.playAudio(this.countdownAudio, this.volumes.timer);

    } else {
      // Other: All specific sounds OFF
      if (this.introVideo) this.introVideo.muted = true;
      this.pauseAudio(this.countdownAudio);
    }
  }

  stopAll() {
    if (this.bgMusic) this.bgMusic.pause();
    if (this.countdownAudio) this.countdownAudio.pause();
    if (this.introVideo) this.introVideo.muted = true;
  }

  muteAll() {
    this.stopAll();
  }

  resumeAudioContexts() {
    this.updatePlaybackState();
  }

  playAudio(audioEl, volume) {
    if (!audioEl) return;
    audioEl.volume = volume;
    if (audioEl.paused) {
      const p = audioEl.play();
      if (p) {
        p.catch(e => {
          if (e.name !== 'AbortError') console.warn("Audio play blocked:", e.message);
        });
      }
    }
  }

  pauseAudio(audioEl) {
    if (audioEl && !audioEl.paused) {
      audioEl.pause();
    }
  }

  setupObservers() {
    const observerOptions = {
      threshold: 0.5 // 50% visibility
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'intro') {
            this.activeSection = 'intro';
          } else if (entry.target.id === 'about') {
            this.activeSection = 'about';
          }
        } else {
          // If leaving the active section, switch to 'other' ONLY if we are not entering another tracked section
          if (entry.target.id === this.activeSection) {
            // We can safely assume 'other' for a moment. 
            // If we entered another section, its callback will fire and overwrite this.
            this.activeSection = 'other';
          }
        }

        if (this.soundEnabled) {
          this.updatePlaybackState();
        }
      });
    }, observerOptions);

    const introSection = document.getElementById('intro');
    const aboutSection = document.getElementById('about');

    if (introSection) observer.observe(introSection);
    if (aboutSection) observer.observe(aboutSection);
  }
}

// Initialize on DOM Ready
$(document).ready(function () {
  window.audioManager = new AudioManager();
});
