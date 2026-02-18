const fs = require('fs');
const path = 'c:\\Users\\KEERTHI VASAN\\Downloads\\vihansa latest\\vihansa-2k26\\js\\main.js';
let lines = fs.readFileSync(path, 'utf8').split('\n');

function replaceBlock(startMarker, endMarker, newLines) {
    let startIdx = -1;
    let endIdx = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(startMarker) && startIdx === -1) {
            startIdx = i;
        }
        if (startIdx !== -1 && lines[i].includes(endMarker)) {
            endIdx = i;
            break;
        }
    }
    if (startIdx !== -1 && endIdx !== -1) {
        lines.splice(startIdx, endIdx - startIdx + 1, ...newLines);
        return true;
    }
    return false;
}

// 1. Global Visibility (Add at top of ready function)
// Find jQuery(document).ready
let readyIdx = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('jQuery(document).ready')) {
        readyIdx = i;
        break;
    }
}
if (readyIdx !== -1) {
    lines.splice(readyIdx + 1, 0,
        "  let isPageVisible = !document.hidden;",
        "  document.addEventListener('visibilitychange', () => { isPageVisible = !document.hidden; });"
    );
}

// 2. Scroll Throttling Update
replaceBlock(
    "$(window).scroll(function () {",
    "if (!scrollTicking) {",
    ["  $(window).scroll(function () {", "    if (!isPageVisible) return;", "    if (!scrollTicking) {"]
);

// 3. Carousel Optimization
const carouselOptimization = [
    "  // Carousel visibility observer",
    "  const carouselObserver = new IntersectionObserver((entries) => {",
    "    entries.forEach(entry => {",
    "      const $owl = $(entry.target);",
    "      if (entry.isIntersecting && isPageVisible) {",
    "        $owl.trigger('play.owl.autoplay');",
    "      } else {",
    "        $owl.trigger('stop.owl.autoplay');",
    "      }",
    "    });",
    "  }, { threshold: 0.1 });",
    "",
    "  // Main gallery carousel",
    "  const $galleryCarousel = $(\".gallery-carousel\");",
    "  $galleryCarousel.owlCarousel({",
    "    autoplay: false, // Start paused",
    "    dots: true,",
    "    loop: true,",
    "    center: true,",
    "    responsive: { 0: 1, 768: 3, 992: 4, 1200: 5 }",
    "  });",
    "  carouselObserver.observe($galleryCarousel[0]);",
    "",
    "  // Events carousel",
    "  const $eventsCarousel = $('.owl-show-events');",
    "  $eventsCarousel.owlCarousel({",
    "    items: 4,",
    "    loop: true,",
    "    dots: true,",
    "    nav: true,",
    "    autoplay: false, // Start paused",
    "    margin: 30,",
    "    responsive: { 0: 1, 600: 2, 1000: 4 }",
    "  });",
    "  carouselObserver.observe($eventsCarousel[0]);",
    "",
    "  // Handle visibility change for carousels",
    "  document.addEventListener('visibilitychange', () => {",
    "    const action = isPageVisible ? 'play.owl.autoplay' : 'stop.owl.autoplay';",
    "    $('.owl-carousel').each(function() {",
    "      if ($(this).is(':visible')) {",
    "        $(this).trigger(action);",
    "      }",
    "    });",
    "  });"
];

replaceBlock(
    "// Main gallery carousel",
    "responsive: { 0: 1, 600: 2, 1000: 4 }",
    ["  });"] // placeholder to be replaced by splice
);
// Re-do correctly
// Actually simpler to just replace the whole block from "// Main gallery carousel" to the end of the second owlCarousel call.
// Let's find the indices.

// 4. Infinite Scroll
const infiniteScrollCode = [
    "  function setupInfiniteScroll() {",
    "    const track = document.querySelector('.gallery-track');",
    "    if (!track) return;",
    "    const items = track.querySelectorAll('.gallery-item');",
    "    items.forEach(item => { track.appendChild(item.cloneNode(true)); });",
    "    let position = 0;",
    "    const speed = 1;",
    "    let isGalleryVisible = false;",
    "    let animationId = null;",
    "    const observer = new IntersectionObserver((entries) => {",
    "      isGalleryVisible = entries[0].isIntersecting;",
    "      if (isGalleryVisible && isPageVisible) {",
    "        if (!animationId) animationId = requestAnimationFrame(animate);",
    "      } else {",
    "        cancelAnimationFrame(animationId);",
    "        animationId = null;",
    "      }",
    "    }, { threshold: 0.1 });",
    "    observer.observe(track);",
    "    function animate() {",
    "      if (!isGalleryVisible || !isPageVisible) { animationId = null; return; }",
    "      position -= speed;",
    "      if (position <= -track.scrollWidth / 2) { position = 0; }",
    "      track.style.transform = `translateX(${position}px)`;",
    "      animationId = requestAnimationFrame(animate);",
    "    }",
    "    document.addEventListener('visibilitychange', () => {",
    "      if (isPageVisible && isGalleryVisible) { if (!animationId) animationId = requestAnimationFrame(animate); }",
    "      else { cancelAnimationFrame(animationId); animationId = null; }",
    "    });",
    "  }"
];

// 5. 3D Tilt
const tiltCode = [
    "const tiltContainer = document.getElementById('tiltContainer');",
    "const tiltInner = document.getElementById('tiltInner');",
    "const tiltShine = document.getElementById('tiltShine');",
    "if (tiltContainer && tiltInner && window.innerWidth >= 768) {",
    "  const maxTilt = 15;",
    "  let cachedRect = null;",
    "  let tiltTicking = false;",
    "  const updateRect = () => { cachedRect = tiltContainer.getBoundingClientRect(); };",
    "  updateRect();",
    "  window.addEventListener('resize', updateRect);",
    "  tiltContainer.addEventListener('mousemove', (e) => {",
    "    if (!isPageVisible) return;",
    "    if (!tiltTicking) {",
    "      requestAnimationFrame(() => {",
    "        if (!cachedRect) return;",
    "        const x = e.clientX - cachedRect.left;",
    "        const y = e.clientY - cachedRect.top;",
    "        const xPct = x / cachedRect.width;",
    "        const yPct = y / cachedRect.height;",
    "        const rotateY = (xPct - 0.5) * maxTilt * 2;",
    "        const rotateX = (0.5 - yPct) * maxTilt * 2;",
    "        tiltInner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;",
    "        if (tiltShine) {",
    "          tiltShine.style.opacity = '1';",
    "          tiltShine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%)`;",
    "        }",
    "        tiltTicking = false;",
    "      });",
    "      tiltTicking = true;",
    "    }",
    "  });",
    "  tiltContainer.addEventListener('mouseleave', () => {",
    "    tiltInner.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';",
    "    tiltInner.style.transition = 'transform 0.5s ease-out';",
    "    setTimeout(() => { tiltInner.style.transition = 'transform 0.1s ease-out'; }, 500);",
    "    if (tiltShine) tiltShine.style.opacity = '0';",
    "  });",
    "  tiltContainer.addEventListener('mouseenter', () => { updateRect(); tiltInner.style.transition = 'transform 0.1s ease-out'; });",
    "}"
];

// Lightning Code
const lightningCode = [
    "  let lightningTicking = false;",
    "  let cachedSectionTop = 0;",
    "  let cachedSectionHeight = 0;",
    "  let cachedWindowHeight = window.innerHeight;",
    "  let lightningLength = lightningPath ? lightningPath.getTotalLength() : 0;",
    "  let isAgendaVisible = false;",
    "  const agendaObserver = new IntersectionObserver((entries) => { isAgendaVisible = entries[0].isIntersecting; }, { threshold: 0.01 });",
    "  if (agendaSection) agendaObserver.observe(agendaSection);",
    "  window.addEventListener('resize', () => {",
    "    cachedSectionTop = agendaSection.offsetTop;",
    "    cachedSectionHeight = agendaSection.offsetHeight;",
    "    cachedWindowHeight = window.innerHeight;",
    "    if (lightningPath) lightningLength = lightningPath.getTotalLength();",
    "  });",
    "  cachedSectionTop = agendaSection.offsetTop;",
    "  cachedSectionHeight = agendaSection.offsetHeight;",
    "  window.addEventListener('scroll', () => {",
    "    if (!lightningPath || !isAgendaVisible || !isPageVisible) return;",
    "    if (!lightningTicking) {",
    "      window.requestAnimationFrame(() => {",
    "        const scrollY = window.scrollY;",
    "        const startOffset = cachedSectionTop - cachedWindowHeight * 0.9;",
    "        const endOffset = cachedSectionTop + cachedSectionHeight - cachedWindowHeight * 0.9;",
    "        let progress = (scrollY - startOffset) / (endOffset - startOffset);",
    "        progress = Math.max(0, Math.min(1, progress));",
    "        lightningPath.style.strokeDashoffset = lightningLength * (1 - progress);",
    "        lightningTicking = false;",
    "      });",
    "      lightningTicking = true;",
    "    }",
    "  }, { passive: true });"
];

// Perform all replacements
replaceBlock("// Main gallery carousel", "responsive: { 0: 1, 600: 2, 1000: 4 }", ["    });", ...carouselOptimization]);
replaceBlock("function setupInfiniteScroll()", "setupInfiniteScroll();", infiniteScrollCode.concat(["  setupInfiniteScroll();"]));
replaceBlock("const tiltContainer = document.getElementById('tiltContainer');", "tiltContainer.addEventListener('mouseenter', () => {", tiltCode);
replaceBlock("let lightningTicking = false;", "lightningTicking = true;", lightningCode);

fs.writeFileSync(path, lines.join('\n'), 'utf8');
console.log('Optimizations applied successfully');
