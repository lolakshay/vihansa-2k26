(function () {
    function isLowPerformance() {
        // 1. CPU Cores check
        const lowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

        // 2. Device Memory check (if supported)
        const lowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;

        // 3. User Agent check for mobile/tablet (often lower performance for complex canvas)
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (lowCPU || lowMemory || isMobile) {
            return true;
        }

        // 4. FPS Check (estimate refresh rate)
        return new Promise(resolve => {
            let frames = 0;
            let startTime = performance.now();

            function checkFPS() {
                frames++;
                const now = performance.now();
                if (now - startTime >= 1000) {
                    const fps = Math.round((frames * 1000) / (now - startTime));
                    // If FPS is significantly below 65 (allowing for some buffer), treat as low refresh/performance
                    // Standard monitors are 60Hz. Gaming are 120Hz+. 
                    // If user specifically asked for <= 65, we stick to that logic.
                    // But 60Hz is standard. Maybe they meant < 60? 
                    // User Request: "If FPS <= 65, treat as low-refresh display." (which includes 60Hz screens)
                    resolve(fps <= 65);
                } else {
                    requestAnimationFrame(checkFPS);
                }
            }
            requestAnimationFrame(checkFPS);
        });
    }

    // Apply class immediately for hardware checks
    const hardwareLow = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
        (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (hardwareLow) {
        document.documentElement.classList.add('low-cursor-performance');
        document.body ? document.body.classList.add('low-cursor-performance') : null; // Safety
        console.log("Low performance detected (Hardware). Cursor effects disabled.");
    } else {
        // For FPS check, we need to wait a bit. 
        // Ideally we run this ASAP.
        // Since this is async, we might need to handle the case where scripts load before this finishes.
        // However, user asked to "Detect... If... Then add class".

        // We can execute the FPS check and add the class if needed. 
        // Scripts checking for this class should wait for DOMContentLoaded or check the class dynamically.

        let frames = 0;
        let startTime = performance.now();

        function checkFPS() {
            frames++;
            const now = performance.now();
            if (now - startTime >= 500) { // Check for 0.5s to be faster
                const fps = Math.round((frames * 1000) / (now - startTime));
                if (fps <= 65) {
                    document.documentElement.classList.add('low-cursor-performance');
                    if (document.body) document.body.classList.add('low-cursor-performance');
                    console.log(`Low performance detected (FPS: ${fps}). Cursor effects disabled.`);
                }
            } else {
                requestAnimationFrame(checkFPS);
            }
        }
        requestAnimationFrame(checkFPS);
    }
})();
