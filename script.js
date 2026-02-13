class GhostBackground {
  constructor(container, options = {}) {
    this.container = container;

    // Configuration
    this.config = {
      trailLength: options.trailLength || 20, // Optimized from 50
      inertia: options.inertia || 0.5,
      brightness: options.brightness || 1.5,
      color: options.color || '#ff0000',
      mixBlendMode: options.mixBlendMode || 'screen',
      edgeIntensity: options.edgeIntensity || 0,
      maxDevicePixelRatio: options.maxDevicePixelRatio || 1.0
    };

    // State
    this.trailBuf = [];
    this.head = 0;
    this.currentMouse = new THREE.Vector2(0.5, 0.5);
    this.velocity = new THREE.Vector2(0, 0);
    this.running = false;
    this.rafId = null;

    this.init();
  }

  init() {
    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: false, // Optimized from true
      alpha: true,
      premultipliedAlpha: false
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.domElement.style.pointerEvents = 'none';

    if (this.config.mixBlendMode) {
      this.renderer.domElement.style.mixBlendMode = this.config.mixBlendMode;
    }

    this.container.appendChild(this.renderer.domElement);

    // Setup scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.geometry = new THREE.PlaneGeometry(2, 2);

    // Initialize trail buffer
    const maxTrail = Math.max(1, Math.floor(this.config.trailLength));
    this.trailBuf = Array.from({ length: maxTrail }, () => new THREE.Vector2(0.5, 0.5));

    // Create material
    const baseColor = new THREE.Color(this.config.color);
    this.material = this.createMaterial(maxTrail, baseColor);

    const mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(mesh);

    // Setup resize
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Setup event listeners for mouse/pointer
    this.setupEventListeners();

    // Start animation
    this.startTime = performance.now();
    this.running = true;
    this.animate();
  }

  setupEventListeners() {
    this.onPointerMove = (e) => {
      const x = Math.max(0, Math.min(1, e.clientX / window.innerWidth));
      const y = Math.max(0, Math.min(1, 1 - (e.clientY / window.innerHeight)));
      this.currentMouse.set(x, y);
    };

    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
  }

  createMaterial(maxTrail, baseColor) {
    // ... (preserving existing createMaterial logic)
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
      uniform float iScale;
      uniform vec3  iBaseColor;
      uniform float iBrightness;
      uniform float iEdgeIntensity;
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
      
      vec3 tint1(vec3 base){ return mix(base, vec3(1.0), 0.15); }
      vec3 tint2(vec3 base){ return mix(base, vec3(0.8, 0.9, 1.0), 0.25); }

      vec4 blob(vec2 p, vec2 mousePos, float intensity, float activity) {
        vec2 q = vec2(fbm(p * iScale + iTime * 0.1), fbm(p * iScale + vec2(5.2,1.3) + iTime * 0.1));
        vec2 r = vec2(fbm(p * iScale + q * 1.5 + iTime * 0.15), fbm(p * iScale + q * 1.5 + vec2(8.3,2.8) + iTime * 0.15));

        float smoke = fbm(p * iScale + r * 0.8);
        float radius = 0.5 + 0.3 * (1.0 / iScale);
        float distFactor = 1.0 - smoothstep(0.0, radius * activity, length(p - mousePos));
        float alpha = pow(smoke, 2.5) * distFactor;

        vec3 c1 = tint1(iBaseColor);
        vec3 c2 = tint2(iBaseColor);
        vec3 color = mix(c1, c2, sin(iTime * 0.5) * 0.5 + 0.5);

        return vec4(color * alpha * intensity, alpha * intensity);
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
        vec2 mouse = (iMouse * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);

        vec3 colorAcc = vec3(0.0);
        float alphaAcc = 0.0;

        vec4 b = blob(uv, mouse, 1.0, iOpacity);
        colorAcc += b.rgb;
        alphaAcc += b.a;

        for (int i = 0; i < ${maxTrail}; i++) {
          vec2 pm = (iPrevMouse[i] * 2.0 - 1.0) * vec2(iResolution.x / iResolution.y, 1.0);
          float t = 1.0 - float(i) / float(${maxTrail});
          t = pow(t, 2.0);
          if (t > 0.01) {
            vec4 bt = blob(uv, pm, t * 0.8, iOpacity);
            colorAcc += bt.rgb;
            alphaAcc += bt.a;
          }
        }

        colorAcc *= iBrightness;

        vec2 uv01 = gl_FragCoord.xy / iResolution.xy;
        float edgeDist = min(min(uv01.x, 1.0 - uv01.x), min(uv01.y, 1.0 - uv01.y));
        float distFromEdge = clamp(edgeDist * 2.0, 0.0, 1.0);
        float k = clamp(iEdgeIntensity, 0.0, 1.0);
        float edgeMask = mix(1.0 - k, 1.0, distFromEdge);

        float outAlpha = clamp(alphaAcc * iOpacity * edgeMask, 0.0, 1.0);
        gl_FragColor = vec4(colorAcc, outAlpha);
      }
    `;

    return new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector3(1, 1, 1) },
        iMouse: { value: new THREE.Vector2(0.5, 0.5) },
        iPrevMouse: { value: this.trailBuf.map(v => v.clone()) },
        iOpacity: { value: 1.0 },
        iScale: { value: 1.0 },
        iBaseColor: { value: new THREE.Vector3(baseColor.r, baseColor.g, baseColor.b) },
        iBrightness: { value: this.config.brightness },
        iEdgeIntensity: { value: this.config.edgeIntensity }
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });
  }

  calculateScale(el) {
    const r = el.getBoundingClientRect();
    const base = 600;
    const current = Math.min(Math.max(1, r.width), Math.max(1, r.height));
    return Math.max(0.5, Math.min(2.0, current / base));
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    const cssW = Math.max(1, Math.floor(rect.width));
    const cssH = Math.max(1, Math.floor(rect.height));

    const pixelRatio = Math.min(window.devicePixelRatio || 1, this.config.maxDevicePixelRatio);

    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(cssW, cssH, false);

    const wpx = Math.max(1, Math.floor(cssW * pixelRatio));
    const hpx = Math.max(1, Math.floor(cssH * pixelRatio));
    this.material.uniforms.iResolution.value.set(wpx, hpx, 1);
    this.material.uniforms.iScale.value = this.calculateScale(this.container);
  }

  animate = () => {
    this.rafId = requestAnimationFrame(this.animate);

    if (document.hidden) return;

    const now = performance.now();
    const t = (now - this.startTime) / 1000;

    // Smoothly interpolate current mouse to target mouse for "inertia" effect
    const dx = this.currentMouse.x - this.material.uniforms.iMouse.value.x;
    const dy = this.currentMouse.y - this.material.uniforms.iMouse.value.y;

    this.material.uniforms.iMouse.value.x += dx * 0.15;
    this.material.uniforms.iMouse.value.y += dy * 0.15;

    // Update trail
    const N = this.trailBuf.length;
    this.head = (this.head + 1) % N;
    this.trailBuf[this.head].copy(this.material.uniforms.iMouse.value);
    const arr = this.material.uniforms.iPrevMouse.value;
    for (let i = 0; i < N; i++) {
      const srcIdx = (this.head - i + N) % N;
      arr[i].copy(this.trailBuf[srcIdx]);
    }

    this.material.uniforms.iOpacity.value = 1.0;
    this.material.uniforms.iTime.value = t;

    this.renderer.render(this.scene, this.camera);
  };
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth <= 768) return; // Disable on mobile

  const bgContainer = document.getElementById('bg-animation-container');
  if (bgContainer) {
    new GhostBackground(bgContainer, {
      trailLength: 60,
      inertia: 0.5,
      brightness: 1.2,
      color: '#ff0000',
      mixBlendMode: 'screen'
    });
  }
});
