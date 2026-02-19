/**
 * Ghost Cursor — Pulsing Red Ring with Radial Glow
 * Pure CSS-based, smooth tracking, zero flicker.
 * Automatically hides on mobile and when tab is hidden.
 */
(function () {
    'use strict';

    // Skip on touch-only devices OR small screens
    if (window.innerWidth <= 768 || ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches)) return;

    var mouseX = 0, mouseY = 0;
    var ringX = 0, ringY = 0;
    var ring, glow;
    var isVisible = !document.hidden;
    var rafId = null;

    function init() {
        // --- Create Ring Element ---
        ring = document.createElement('div');
        ring.id = 'ghost-ring';
        ring.style.cssText = [
            'position: fixed',
            'width: 40px',
            'height: 40px',
            'border: 2px solid rgba(255, 30, 30, 0.7)',
            'border-radius: 50%',
            'pointer-events: none',
            'z-index: 999999',
            'transform: translate(-50%, -50%)',
            'transition: width 0.2s, height 0.2s, border-color 0.3s',
            'box-shadow: 0 0 15px rgba(255, 0, 0, 0.4), 0 0 30px rgba(255, 0, 0, 0.2), inset 0 0 10px rgba(255, 0, 0, 0.15)',
            'animation: ghostPulse 2s ease-in-out infinite',
            'top: 0',
            'left: 0',
            'will-change: transform'
        ].join(';');

        // --- Create Glow Element (inner soft dot) ---
        glow = document.createElement('div');
        glow.id = 'ghost-glow';
        glow.style.cssText = [
            'position: fixed',
            'width: 8px',
            'height: 8px',
            'background: radial-gradient(circle, rgba(255, 60, 60, 0.9) 0%, rgba(255, 0, 0, 0.4) 50%, transparent 70%)',
            'border-radius: 50%',
            'pointer-events: none',
            'z-index: 999999',
            'transform: translate(-50%, -50%)',
            'top: 0',
            'left: 0',
            'will-change: transform'
        ].join(';');

        // --- Inject Keyframes ---
        var style = document.createElement('style');
        style.textContent = [
            '@keyframes ghostPulse {',
            '  0%, 100% { box-shadow: 0 0 15px rgba(255,0,0,0.4), 0 0 30px rgba(255,0,0,0.2), inset 0 0 10px rgba(255,0,0,0.15); transform: translate(-50%,-50%) scale(1); }',
            '  50% { box-shadow: 0 0 25px rgba(255,0,0,0.6), 0 0 50px rgba(255,0,0,0.3), inset 0 0 15px rgba(255,0,0,0.25); transform: translate(-50%,-50%) scale(1.15); }',
            '}',
            '',
            '/* Expand ring on hover over clickable elements */',
            'body.ghost-hover #ghost-ring {',
            '  width: 55px;',
            '  height: 55px;',
            '  border-color: rgba(255, 80, 80, 0.9);',
            '}',
            '',
            '/* Hide default cursor */',
            '*, *::before, *::after { cursor: none !important; }'
        ].join('\n');

        document.head.appendChild(style);
        document.body.appendChild(ring);
        document.body.appendChild(glow);

        // --- Events ---
        document.addEventListener('mousemove', onMouseMove, { passive: true });
        document.addEventListener('visibilitychange', onVisibility);

        // Hover detection for interactive elements
        document.addEventListener('mouseover', function (e) {
            var el = e.target;
            if (el.matches('a, button, [onclick], input, select, textarea, .electric-card, .st-tab, .nav-link, .btn')) {
                document.body.classList.add('ghost-hover');
            }
        }, { passive: true });

        document.addEventListener('mouseout', function (e) {
            var el = e.target;
            if (el.matches('a, button, [onclick], input, select, textarea, .electric-card, .st-tab, .nav-link, .btn')) {
                document.body.classList.remove('ghost-hover');
            }
        }, { passive: true });

        startLoop();
    }

    function onMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Inner glow dot follows instantly
        glow.style.left = mouseX + 'px';
        glow.style.top = mouseY + 'px';
    }

    function onVisibility() {
        isVisible = !document.hidden;
        if (isVisible) startLoop();
        else stopLoop();
    }

    // Smooth lerp tracking for the ring (slight lag = ghostly feel)
    function loop() {
        if (!isVisible) return;

        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';

        rafId = requestAnimationFrame(loop);
    }

    function startLoop() {
        if (rafId) return;
        rafId = requestAnimationFrame(loop);
    }

    function stopLoop() {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    // --- BOOT ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
