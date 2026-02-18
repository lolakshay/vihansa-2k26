const fs = require('fs');
const path = 'c:\\Users\\KEERTHI VASAN\\Downloads\\vihansa latest\\vihansa-2k26\\js\\main.js';
let content = fs.readFileSync(path, 'utf8');

// Use markers to find sections if possible, or large blocks.

// 1. Global visibility & Scroll Throttling
const scrollOld = `  // Back to top button & Header fixed - Throttled
  let scrollTicking = false;

  $(window).scroll(function () {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        const scrollTop = $(this).scrollTop();`;

const scrollNew = `  // Back to top button & Header fixed - Throttled
  let scrollTicking = false;
  let isPageVisible = !document.hidden;

  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
  });

  $(window).scroll(function () {
    if (!isPageVisible) return;
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        const scrollTop = $(this).scrollTop();`;

content = content.replace(scrollOld, scrollNew);

// 2. Carousels
const carouselOld = `  // Main gallery carousel
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
  });`;

const carouselNew = `  // Carousel visibility observer
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

  // Handle visibility change for carousels
  document.addEventListener('visibilitychange', () => {
    const action = isPageVisible ? 'play.owl.autoplay' : 'stop.owl.autoplay';
    $('.owl-carousel').each(function() {
      if ($(this).is(':visible')) {
        $(this).trigger(action);
      }
    });
  });`;

content = content.replace(carouselOld, carouselNew);

// 3. Infinite Scroll
const infiniteOld = `  // Gallery scroll function
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

      track.style.transform = `translateX(${ position }px)`;
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

  setupInfiniteScroll();`;

const infiniteNew = `  // Gallery scroll function
  function setupInfiniteScroll() {
    const track = document.querySelector('.gallery-track');
    if (!track) return;

    // Clone and append items for seamless looping
    const items = track.querySelectorAll('.gallery-item');
    items.forEach(item => {
      track.appendChild(item.cloneNode(true));
    });

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
      if (!isGalleryVisible || !isPageVisible) {
        animationId = null;
        return;
      }

      position -= speed;
      if (position <= -track.scrollWidth / 2) {
        position = 0;
      }

      track.style.transform = \`translateX(\${position}px)\`;
      animationId = requestAnimationFrame(animate);
    }

    // Handle global visibility change
    document.addEventListener('visibilitychange', () => {
      if (isPageVisible && isGalleryVisible) {
        if (!animationId) animationId = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    });
  }

  setupInfiniteScroll();`;

content = content.replace(infiniteOld, infiniteNew);

// 4. 3D Tilt
const tiltOld = `const tiltContainer = document.getElementById('tiltContainer');
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
    tiltInner.style.transform = \`
      perspective(1000px)
      rotateX(\${rotateX}deg)
      rotateY(\${rotateY}deg)
      scale3d(1.05, 1.05, 1.05)
    \`;

    // Shine Effect
    if (tiltShine) {
      tiltShine.style.opacity = '1';
      tiltShine.style.background = \`
        radial-gradient(circle at \${x}px \${y}px, 
        rgba(255,255,255,0.2) 0%, 
        rgba(255,255,255,0) 80%)
      \`;
    }
  });

  // Mouse Leave - Reset
  tiltContainer.addEventListener('mouseleave', () => {
    tiltInner.style.transform = \`
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      scale3d(1, 1, 1)
    \`;

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
}`;

const tiltNew = `const tiltContainer = document.getElementById('tiltContainer');
const tiltInner = document.getElementById('tiltInner');
const tiltShine = document.getElementById('tiltShine');

// Disable on mobile and only if elements exist
if (tiltContainer && tiltInner && window.innerWidth >= 768) {
  const maxTilt = 15;
  let cachedRect = null;
  let tiltTicking = false;

  const updateRect = () => {
    cachedRect = tiltContainer.getBoundingClientRect();
  };

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

        tiltInner.style.transform = \`
          perspective(1000px)
          rotateX(\${rotateX}deg)
          rotateY(\${rotateY}deg)
          scale3d(1.05, 1.05, 1.05)
        \`;

        if (tiltShine) {
          tiltShine.style.opacity = '1';
          tiltShine.style.background = \`radial-gradient(circle at \${x}px \${y}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%)\`;
        }
        tiltTicking = false;
      });
      tiltTicking = true;
    }
  });

  tiltContainer.addEventListener('mouseleave', () => {
    tiltInner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    tiltInner.style.transition = 'transform 0.5s ease-out';
    setTimeout(() => {
      tiltInner.style.transition = 'transform 0.1s ease-out';
    }, 500);

    if (tiltShine) tiltShine.style.opacity = '0';
  });

  tiltContainer.addEventListener('mouseenter', () => {
    updateRect(); // Refresh rect on enter
    tiltInner.style.transition = 'transform 0.1s ease-out';
  });
}`;

content = content.replace(tiltOld, tiltNew);

// 5. Lightning Scroll
const lightningOld = `  // Scroll-based lightning draw animation - Optimized
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
  });`;

const lightningNew = `  // Scroll-based lightning draw animation - Optimized
  let lightningTicking = false;
  let cachedSectionTop = 0;
  let cachedSectionHeight = 0;
  let cachedWindowHeight = window.innerHeight;
  let lightningLength = lightningPath ? lightningPath.getTotalLength() : 0;
  let isAgendaVisible = false;

  const agendaObserver = new IntersectionObserver((entries) => {
    isAgendaVisible = entries[0].isIntersecting;
  }, { threshold: 0.01 });
  if (agendaSection) agendaObserver.observe(agendaSection);

  // Update cached values on resize
  window.addEventListener('resize', () => {
    cachedSectionTop = agendaSection.offsetTop;
    cachedSectionHeight = agendaSection.offsetHeight;
    cachedWindowHeight = window.innerHeight;
    if (lightningPath) lightningLength = lightningPath.getTotalLength();
  });

  // Initial calculation
  cachedSectionTop = agendaSection.offsetTop;
  cachedSectionHeight = agendaSection.offsetHeight;

  window.addEventListener("scroll", () => {
    if (!lightningPath || !isAgendaVisible || !isPageVisible) return;

    if (!lightningTicking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Determine how far we are into the section
        const startOffset = cachedSectionTop - cachedWindowHeight * 0.9;
        const endOffset = cachedSectionTop + cachedSectionHeight - cachedWindowHeight * 0.9;

        let progress = (scrollY - startOffset) / (endOffset - startOffset);
        progress = Math.max(0, Math.min(1, progress));

        lightningPath.style.strokeDashoffset = lightningLength * (1 - progress);
        lightningTicking = false;
      });
      lightningTicking = true;
    }
  }, { passive: true });`;

content = content.replace(lightningOld, lightningNew);

fs.writeFileSync(path, content, 'utf8');
console.log('Optimizations applied successfully');
