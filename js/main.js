let isPageVisible = !document.hidden;
document.addEventListener("visibilitychange", () => { isPageVisible = !document.hidden; });

/**
 * AudioManager handles all site-wide audio logic.
 */
class AudioManager {
  constructor() {
    this.bgMusic = document.getElementById('bg-music');
    this.countdownAudio = document.getElementById('countdown-audio');
    this.introVideo = document.getElementById('bg-video');
    this.toggleBtn = document.getElementById('music-toggle');

    // State persistence
    this.soundEnabled = localStorage.getItem('musicEnabled') === 'true' ||
      localStorage.getItem('vihansa_sound_enabled') === 'true';
    this.isUnlocked = false;
    this.activeSection = 'intro';

    this.volumes = {
      music: 0.3,
      intro: 0.5,
      timer: 0.4
    };

    this.init();
  }

  init() {
    this.updateIcon();

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleSound();
      });
    }

    const unlockHandler = () => {
      this.isUnlocked = true;
      if (this.soundEnabled) this.resumeAudioContexts();
      ['click', 'keydown', 'touchstart'].forEach(evt =>
        document.removeEventListener(evt, unlockHandler)
      );
    };
    ['click', 'keydown', 'touchstart'].forEach(evt =>
      document.addEventListener(evt, unlockHandler)
    );

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.stopAll();
      else if (this.soundEnabled) this.resumeAudioContexts();
    });

    this.setupObservers();
    this.configureElements();

    if (this.soundEnabled) this.resumeAudioContexts();
  }

  configureElements() {
    if (this.bgMusic) { this.bgMusic.loop = true; this.bgMusic.volume = this.volumes.music; }
    if (this.countdownAudio) { this.countdownAudio.loop = true; this.countdownAudio.volume = this.volumes.timer; }
    if (this.introVideo) {
      this.introVideo.loop = true;
      this.introVideo.muted = true;
      this.introVideo.setAttribute('playsinline', '');
      this.introVideo.volume = this.volumes.intro;

      const tryPlay = () => { this.introVideo.play().catch(() => { }); };
      if (this.introVideo.readyState >= 3) tryPlay();
      else this.introVideo.addEventListener('canplay', tryPlay, { once: true });

      this.startVideoWatchdog();
    }
  }

  startVideoWatchdog() {
    if (!this.introVideo) return;
    let lastTime = -1;
    let stallCount = 0;
    setInterval(() => {
      if (document.hidden) return;
      const currentTime = this.introVideo.currentTime;
      const isPaused = this.introVideo.paused;

      if (isPaused && this.activeSection === 'intro') {
        this.introVideo.play().catch(() => { });
        return;
      }
      if (!isPaused && currentTime === lastTime && currentTime !== 0) {
        stallCount++;
        if (stallCount > 5) {
          this.introVideo.currentTime += 0.1;
          this.introVideo.play().catch(() => { });
          stallCount = 0;
        }
      } else stallCount = 0;
      lastTime = currentTime;
    }, 500);
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('vihansa_sound_enabled', this.soundEnabled);
    localStorage.setItem('musicEnabled', this.soundEnabled);
    this.updateIcon();
    if (this.soundEnabled) { this.isUnlocked = true; this.resumeAudioContexts(); }
    else this.stopAll();
  }

  updateIcon() {
    if (!this.toggleBtn) return;
    if (this.soundEnabled) {
      this.toggleBtn.classList.add('playing');
      this.toggleBtn.innerHTML = '<i class="fa fa-volume-up"></i>';
      this.toggleBtn.style.opacity = '1';
    } else {
      this.toggleBtn.classList.remove('playing');
      this.toggleBtn.innerHTML = '<i class="fa fa-volume-off"></i>';
      this.toggleBtn.style.opacity = '0.7';
    }
  }

  updatePlaybackState() {
    if (!this.soundEnabled) return;
    if (this.bgMusic && this.bgMusic.paused) this.bgMusic.play().catch(() => { });

    if (this.activeSection === 'intro') {
      if (this.introVideo) { this.introVideo.muted = false; this.introVideo.volume = this.volumes.intro; }
      if (this.countdownAudio) this.countdownAudio.pause();
    } else if (this.activeSection === 'about') {
      if (this.introVideo) this.introVideo.muted = true;
      if (this.countdownAudio && this.countdownAudio.paused) this.countdownAudio.play().catch(() => { });
    } else {
      if (this.introVideo) this.introVideo.muted = true;
      if (this.countdownAudio) this.countdownAudio.pause();
    }
  }

  stopAll() {
    if (this.bgMusic) this.bgMusic.pause();
    if (this.countdownAudio) this.countdownAudio.pause();
    if (this.introVideo) this.introVideo.muted = true;
  }

  resumeAudioContexts() { this.updatePlaybackState(); }

  playAudio(audioEl, volume) {
    if (!audioEl) return;
    audioEl.volume = volume;
    if (audioEl.paused) audioEl.play().catch(() => { });
  }

  pauseAudio(audioEl) {
    if (audioEl && !audioEl.paused) audioEl.pause();
  }

  setupObservers() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'intro') this.activeSection = 'intro';
          else if (entry.target.id === 'about') this.activeSection = 'about';
        } else if (entry.target.id === this.activeSection) {
          this.activeSection = 'other';
        }
        if (this.soundEnabled) this.updatePlaybackState();
      });
    }, { threshold: 0.5 });
    const introSection = document.getElementById('intro');
    const aboutSection = document.getElementById('about');
    if (introSection) observer.observe(introSection);
    if (aboutSection) observer.observe(aboutSection);
  }
}

jQuery(document).ready(function ($) {
  // Initialize AudioManager
  window.audioManager = new AudioManager();



  /******************************
   * 1. INITIALIZE LIBRARIES
   ******************************/

  // VOLUME CONTROLS (0.0 to 1.0)
  const VOL_BG_MUSIC = 0.3;      // Background Music
  const VOL_INTRO_VIDEO = 0.5;   // Intro Video
  const VOL_COUNTDOWN = 0.4;     // Countdown Ticker



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
    if (!isPageVisible) return;
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
  // Carousel visibility observer
  const carouselObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const $owl = $(entry.target);
      if (entry.isIntersecting && isPageVisible) {
        $owl.trigger('play.owl.autoplay');
      } else {
        $owl.trigger('stop.owl.autoplay');
      }
    });
  }, { threshold: 0.1 });

  // Main gallery carousel
  const $galleryCarousel = $(".gallery-carousel");
  $galleryCarousel.owlCarousel({
    autoplay: false, // Start paused
    dots: true,
    loop: true,
    center: true,
    responsive: { 0: 1, 768: 3, 992: 4, 1200: 5 }
  });
  carouselObserver.observe($galleryCarousel[0]);

  // Events carousel
  const $eventsCarousel = $('.owl-show-events');
  $eventsCarousel.owlCarousel({
    items: 4,
    loop: true,
    dots: true,
    nav: true,
    autoplay: false, // Start paused
    margin: 30,
    responsive: { 0: 1, 600: 2, 1000: 4 }
  });
  carouselObserver.observe($eventsCarousel[0]);

  // Handle visibility change for carousels
  document.addEventListener('visibilitychange', () => {
    const action = isPageVisible ? 'play.owl.autoplay' : 'stop.owl.autoplay';
    $('.owl-carousel').each(function() {
      if ($(this).is(':visible')) {
        $(this).trigger(action);
      }
    });
  });
  // Gallery scroll function
  function setupInfiniteScroll() {
    const track = document.querySelector('.gallery-track');
    if (!track) return;
    const items = track.querySelectorAll('.gallery-item');
    items.forEach(item => { track.appendChild(item.cloneNode(true)); });
    let position = 0;
    const speed = 1;
    let isGalleryVisible = false;
    let animationId = null;
    const observer = new IntersectionObserver((entries) => {
      isGalleryVisible = entries[0].isIntersecting;
      if (isGalleryVisible && isPageVisible) {
        if (!animationId) animationId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }, { threshold: 0.1 });
    observer.observe(track);
    function animate() {
      if (!isGalleryVisible || !isPageVisible) { animationId = null; return; }
      position -= speed;
      if (position <= -track.scrollWidth / 2) { position = 0; }
      track.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    }
    document.addEventListener('visibilitychange', () => {
      if (isPageVisible && isGalleryVisible) { if (!animationId) animationId = requestAnimationFrame(animate); }
      else { cancelAnimationFrame(animationId); animationId = null; }
    });
  }
  setupInfiniteScroll();

  /******************************
   * 6. COUNTDOWN TIMER
   ******************************/
  const second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24;
  let countDown = new Date("03-13-2026").getTime();

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
   * 8. AUDIO FEEDBACK (MUSIC NOTES)
   ******************************/
  const clickSound = new Audio('audio/click-note.mp3');

  function playFeedbackSound() {
    clickSound.currentTime = 0;
    clickSound.play().catch(() => { });
  }

  $('.nav-tabs .nav-link, .electric-card').on('click', function () {
    playFeedbackSound();
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
  if (tiltContainer && tiltInner && window.innerWidth >= 768) {
    const maxTilt = 15;
    let cachedRect = null;
    let tiltTicking = false;
    const updateRect = () => { cachedRect = tiltContainer.getBoundingClientRect(); };
    updateRect();
    window.addEventListener('resize', updateRect);
    tiltContainer.addEventListener('mousemove', (e) => {
      if (!isPageVisible) return;
      if (!tiltTicking) {
        requestAnimationFrame(() => {
          if (!cachedRect) return;
          const x = e.clientX - cachedRect.left;
          const y = e.clientY - cachedRect.top;
          const xPct = x / cachedRect.width;
          const yPct = y / cachedRect.height;
          const rotateY = (xPct - 0.5) * maxTilt * 2;
          const rotateX = (0.5 - yPct) * maxTilt * 2;
          tiltInner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
          if (tiltShine) {
            tiltShine.style.opacity = '1';
            tiltShine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%)`;
          }
          tiltTicking = false;
        });
        tiltTicking = true;
      }
    });
    tiltContainer.addEventListener('mouseleave', () => {
      tiltInner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      tiltInner.style.transition = 'transform 0.5s ease-out';
      setTimeout(() => { tiltInner.style.transition = 'transform 0.1s ease-out'; }, 500);
      if (tiltShine) tiltShine.style.opacity = '0';
    });
    tiltContainer.addEventListener('mouseenter', () => { updateRect(); tiltInner.style.transition = 'transform 0.1s ease-out'; });
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
                                <a href="javascript:void(0)" onclick="openEventModal('${event.id}')" class="me-cta-btn">${event.cta} <i class="fa fa-arrow-right"></i></a>
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

  /* ==========================================================================
     LIGHTNING TIMELINE LOGIC
     ========================================================================== */
  const agendaSection = document.querySelector('.stranger-agenda');
  if (agendaSection) {
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
    let lightningLength = lightningPath ? lightningPath.getTotalLength() : 0;
    let isAgendaVisible = false;
    const agendaObserver = new IntersectionObserver((entries) => { isAgendaVisible = entries[0].isIntersecting; }, { threshold: 0.01 });
    agendaObserver.observe(agendaSection);
    window.addEventListener('resize', () => {
      cachedSectionTop = agendaSection.offsetTop;
      cachedSectionHeight = agendaSection.offsetHeight;
      cachedWindowHeight = window.innerHeight;
      if (lightningPath) lightningLength = lightningPath.getTotalLength();
    });
    cachedSectionTop = agendaSection.offsetTop;
    cachedSectionHeight = agendaSection.offsetHeight;
    window.addEventListener('scroll', () => {
      if (!lightningPath || !isAgendaVisible || !isPageVisible) return;
      if (!lightningTicking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const startOffset = cachedSectionTop - cachedWindowHeight * 0.9;
          const endOffset = cachedSectionTop + cachedSectionHeight - cachedWindowHeight * 0.9;
          let progress = (scrollY - startOffset) / (endOffset - startOffset);
          progress = Math.max(0, Math.min(1, progress));
          lightningPath.style.strokeDashoffset = lightningLength * (1 - progress);
          lightningTicking = false;
        });
        lightningTicking = true;
      }
    }, { passive: true });

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
  }

}); // End jQuery(document).ready














/* ==========================================================================
   EVENT DETAILS MODAL LOGIC
   ========================================================================== */

// Event Data - Extensible for all events
// eventDetails object removed and moved to js/event-details.json for performance
let cachedEventDetails = null;


async function openEventModal(eventId) {
  // Try to load from cache first
  if (!cachedEventDetails) {
    try {
      const response = await fetch('js/event-details.json');
      if (!response.ok) throw new Error('Fetch failed');
      cachedEventDetails = await response.json();
    } catch (err) {
      console.error('Error loading event details:', err);
      return;
    }
  }

  const event = cachedEventDetails[eventId];
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






// Preloader Handling
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('loaded');
    setTimeout(() => { preloader.style.display = 'none'; }, 600);
  }
});
setTimeout(() => {
  const preloader = document.getElementById('preloader');
  if (preloader && !preloader.classList.contains('loaded')) {
    preloader.classList.add('loaded');
  }
}, 5000);

/* ==========================================================================
   Rule Book Modal Functions
   ========================================================================== */
function openRuleBook() {
  document.getElementById('ruleBookModal').style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Disable background scrolling
}

function closeRuleBook() {
  document.getElementById('ruleBookModal').style.display = 'none';
  document.body.style.overflow = 'auto'; // Enable background scrolling
}

// Close modal when clicking outside of the content
window.onclick = function (event) {
  var modal = document.getElementById('ruleBookModal');
  if (event.target == modal) {
    closeRuleBook();
  }
}
