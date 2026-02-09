document.addEventListener('DOMContentLoaded', () => {
    const cursor = document.getElementById('cursor');
    const cursorBlur = document.getElementById('cursor-blur');

    if (!cursor || !cursorBlur) return;

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let blurX = 0;
    let blurY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        // Smooth follow for main cursor
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * 0.2;
        cursorY += dy * 0.2;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Slower follow for blur
        const bdx = mouseX - blurX;
        const bdy = mouseY - blurY;

        blurX += bdx * 0.1;
        blurY += bdy * 0.1;

        cursorBlur.style.left = blurX + 'px';
        cursorBlur.style.top = blurY + 'px';

        requestAnimationFrame(animate);
    }

    animate();

    // Hover Effects
    const links = document.querySelectorAll('a, button, .event-item, .gallery-item');

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            document.body.classList.add('hovered');
        });

        link.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovered');
        });
    });
});
