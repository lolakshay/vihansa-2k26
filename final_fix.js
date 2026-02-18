const fs = require('fs');
const path = 'c:\\Users\\KEERTHI VASAN\\Downloads\\vihansa latest\\vihansa-2k26\\js\\main.js';
let lines = fs.readFileSync(path, 'utf8').split('\n');

// Fix 1: Restore Carousels
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

// Lines 132-136 (indices 131-135)
lines.splice(131, 5, ...carouselOptimization);

// Fix 2: 3D Tilt Braces (The index might have shifted after splice)
// Let's find it again by content to be safe but using simple match
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("tiltContainer.addEventListener('mouseenter'") && lines[i + 1] && lines[i + 1].trim() === "}") {
        if (lines[i + 2] && lines[i + 2].includes("tiltInner.style.transition")) {
            lines.splice(i + 2, 3); // Remove the extra bits
            break;
        }
    }
}

// Fix 3: Lightning Braces
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("}, { passive: true });") && lines[i + 1] && lines[i + 1].trim() === "}") {
        if (lines[i + 2] && lines[i + 2].trim() === "});") {
            lines.splice(i + 1, 2); // Remove the extra redundant closing of DOMContentLoaded if duplicated
            break;
        }
    }
}

fs.writeFileSync(path, lines.join('\n'), 'utf8');
console.log('Final fixes applied successfully');
