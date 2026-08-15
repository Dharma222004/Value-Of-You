---
name: motion-graphics-web
description: >
  End-to-end reference for building production-quality, motion-rich websites.
  Covers philosophy, technology selection, animation choreography, code patterns,
  performance, and accessibility. Use whenever the deliverable involves any
  non-trivial animation: scroll effects, entrance reveals, particle fields,
  3-D scenes, SVG morphing, or interactive micro-animations.
version: 1.0.0
---

# Motion Graphics — Website Creation Skill

> **Core directive:** Motion is a design material, not a decoration layer.
> Every animation must earn its place by communicating something — hierarchy,
> causality, personality, or state change. Apply this filter before writing
> a single keyframe.

---

## 1. Philosophy & Principles

### 1.1 The Four Laws of Web Motion

| Law | Statement | Violation looks like |
|-----|-----------|----------------------|
| **Purpose** | Every animation serves a clear UX or brand goal | Loading spinners on static content; hover effects on non-interactive elements |
| **Hierarchy** | The most important element moves first and most boldly | Everything fading in simultaneously at equal weight |
| **Continuity** | Motion tells a coherent spatial story across states | Elements teleporting rather than traveling between positions |
| **Economy** | One scene, one signature move | Six different easing curves fighting for attention on the same screen |

### 1.2 Timing Reference Table

| Animation type | Duration | Easing |
|----------------|----------|--------|
| Micro-interaction (button, toggle) | 80–150 ms | `ease-out` |
| UI transition (modal, drawer) | 200–350 ms | `cubic-bezier(0.4, 0, 0.2, 1)` (Material standard) |
| Page-section entrance reveal | 400–700 ms | `cubic-bezier(0.16, 1, 0.3, 1)` (spring-like) |
| Hero / cinematic sequence | 800–1400 ms | Custom GSAP timeline with staggered children |
| Ambient / looping motion | Variable | `linear` or custom spring |

### 1.3 Easing Vocabulary

```css
/* Spring — elements that snap into place with confidence */
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);

/* Out expo — fast start, slow arrival (most UI elements) */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

/* In-out quart — symmetric, cinematic */
--ease-cinematic: cubic-bezier(0.76, 0, 0.24, 1);

/* Bounce (use sparingly, only for playful brands) */
--ease-bounce:   cubic-bezier(0.34, 1.8, 0.64, 1);
```

---

## 2. Technology Stack

### 2.1 Selection Matrix

Choose your stack based on project needs — never install all libraries by default.

| Need | First choice | Alternative | Avoid |
|------|-------------|-------------|-------|
| CSS-only micro-animations | Native CSS | — | Overkill JS |
| Scroll-triggered reveals | GSAP ScrollTrigger | Intersection Observer + CSS classes | AOS (limited) |
| Complex timeline sequences | GSAP (gsap.com) | anime.js | CSS only |
| React component transitions | Framer Motion | React Spring | jQuery animate |
| 3-D / WebGL scenes | Three.js + R3F | Babylon.js | CSS 3D for real 3-D |
| Lottie / After Effects export | lottie-web | rive-app (Rive) | GIF |
| SVG morphing | GSAP MorphSVG | Flubber.js | CSS |
| Particle systems | tsParticles / particles.js | Three.js Points | Canvas raw for simple cases |
| Physics simulations | Matter.js | Rapier (WASM) | — |
| Video background | Native `<video>` + poster | — | GIF |

### 2.2 CDN Imports (for HTML artifacts)

```html
<!-- GSAP core + plugins -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/TextPlugin.min.js"></script>

<!-- Three.js r128 -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- Lottie -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
```

### 2.3 NPM / React Imports

```bash
npm install gsap framer-motion three @react-three/fiber @react-three/drei
npm install lottie-react tsparticles @tsparticles/react
npm install animejs  # lightweight alternative
```

---

## 3. Animation Taxonomy & Patterns

### 3.1 Entrance Reveals (Scroll-Triggered)

**CSS-only approach (Intersection Observer)**

```css
/* Base state — elements start invisible and shifted */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.6s var(--ease-out-expo),
              transform 0.6s var(--ease-out-expo);
}

.reveal.in-view {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger siblings using nth-child delay */
.reveal:nth-child(1) { transition-delay: 0ms; }
.reveal:nth-child(2) { transition-delay: 80ms; }
.reveal:nth-child(3) { transition-delay: 160ms; }
.reveal:nth-child(4) { transition-delay: 240ms; }
```

```javascript
// Intersection Observer setup
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        observer.unobserve(e.target); // fire once
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

**GSAP ScrollTrigger approach (more control)**

```javascript
gsap.registerPlugin(ScrollTrigger);

// Batch reveals — best for lists of cards
ScrollTrigger.batch('.card', {
  onEnter: (elements) => {
    gsap.from(elements, {
      opacity: 0,
      y: 60,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
    });
  },
  once: true,
  start: 'top 88%',
});

// Individual section with scrub
gsap.timeline({
  scrollTrigger: {
    trigger: '.section-hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1.5,
  }
})
.to('.hero-bg', { yPercent: 30 })          // parallax
.to('.hero-title', { opacity: 0, y: -40 }, '<'); // pin-fade title
```

---

### 3.2 Hero Entrance Sequences

The hero should load as a **choreographed timeline**, not random simultaneous fades.

```javascript
// GSAP master timeline — stagger children by role
function heroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl
    // 1. Background / canvas fades first
    .from('.hero-bg', { opacity: 0, duration: 1.2 })

    // 2. Overline or eyebrow label
    .from('.hero-eyebrow', {
      opacity: 0, y: 16, duration: 0.5
    }, '-=0.6')

    // 3. Main headline — split by lines
    .from('.hero-title .line', {
      opacity: 0, y: 48, skewY: 4,
      stagger: 0.12, duration: 0.7
    }, '-=0.3')

    // 4. Subheadline
    .from('.hero-sub', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')

    // 5. CTA button with spring
    .from('.hero-cta', {
      opacity: 0, y: 20, scale: 0.95,
      duration: 0.5, ease: 'back.out(1.7)'
    }, '-=0.2')

    // 6. Decorative / supporting elements last
    .from('.hero-decor', { opacity: 0, stagger: 0.08, duration: 0.4 }, '-=0.2');

  return tl;
}
```

**SplitText Pattern (word/character reveals)**

```javascript
// Without GSAP SplitText plugin — manual split
function splitLines(selector) {
  const el = document.querySelector(selector);
  const words = el.innerText.split(' ');
  el.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');
}

splitLines('.hero-title');

gsap.from('.word', {
  opacity: 0,
  y: '110%',
  rotateX: -40,
  stagger: 0.04,
  duration: 0.7,
  ease: 'power4.out',
  transformOrigin: 'bottom center',
});
```

---

### 3.3 Scroll-Linked / Scrub Animations

```javascript
// Horizontal scroll section
const sections = gsap.utils.toArray('.h-section');
const hTrack = document.querySelector('.h-track');

gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.h-scroll-wrapper',
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => '+=' + hTrack.offsetWidth,
  }
});

// Counter / number roll-up on scroll
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  ScrollTrigger.create({
    trigger: el,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to({ val: 0 }, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        onUpdate: function () {
          el.textContent = Math.round(this.targets()[0].val).toLocaleString();
        }
      });
    }
  });
}
document.querySelectorAll('[data-counter]').forEach(animateCounter);
```

---

### 3.4 Cursor & Magnetic Effects

```javascript
// Custom cursor follower
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1 });
});

// Lerp-based smooth follower
function updateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  gsap.set(follower, { x: followerX, y: followerY });
  requestAnimationFrame(updateFollower);
}
updateFollower();

// Magnetic button pull
document.querySelectorAll('.btn-magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    gsap.to(btn, { x: dx * 0.35, y: dy * 0.35, duration: 0.4, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  });
});
```

---

### 3.5 Three.js / WebGL Scenes

**Minimal setup template (inside `<script>` or component)**

```javascript
// --- Scene setup ---
const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#canvas'), antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
camera.position.z = 4;

// --- Geometry ---
const geometry = new THREE.TorusKnotGeometry(1, 0.35, 128, 32);
const material = new THREE.MeshStandardMaterial({
  color: 0x6c63ff,
  metalness: 0.4,
  roughness: 0.2,
  wireframe: false,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// --- Lighting ---
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
const point   = new THREE.PointLight(0x00d4ff, 2, 10);
point.position.set(3, 3, 3);
scene.add(ambient, point);

// --- Scroll-linked rotation ---
let scrollY = 0;
window.addEventListener('scroll', () => { scrollY = window.scrollY; });

// --- Render loop ---
function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.004;
  mesh.rotation.y += 0.006 + scrollY * 0.00005;
  renderer.render(scene, camera);
}
animate();

// --- Resize ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

**Particle field (Points)**

```javascript
const count = 3000;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 12;
}
const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const mat = new THREE.PointsMaterial({ color: 0xaaaaff, size: 0.025 });
scene.add(new THREE.Points(geo, mat));
```

---

### 3.6 SVG Animations (CSS & GSAP)

```css
/* --- Stroke draw-on effect --- */
.svg-path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 2s var(--ease-out-expo) forwards;
}
@keyframes draw {
  to { stroke-dashoffset: 0; }
}

/* --- Blob morphing (CSS) --- */
@keyframes blob-morph {
  0%   { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50%  { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
}
.blob {
  animation: blob-morph 8s ease-in-out infinite;
}
```

```javascript
// GSAP SVG morph between two paths
gsap.to('#shape1', {
  duration: 2,
  repeat: -1,
  yoyo: true,
  ease: 'power1.inOut',
  attr: {
    d: 'M100,50 C150,10 200,10 250,50 C300,90 300,150 250,190 ...'
  }
});
```

---

### 3.7 Lottie Animations

```javascript
import lottie from 'lottie-web';

const animation = lottie.loadAnimation({
  container: document.getElementById('lottie-container'),
  renderer: 'svg',              // 'svg' | 'canvas' | 'html'
  loop: true,
  autoplay: false,
  path: '/animations/hero.json', // or animationData: jsonObject
});

// Sync with scroll position
window.addEventListener('scroll', () => {
  const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  animation.goToAndStop(Math.floor(progress * animation.totalFrames), true);
});
```

---

### 3.8 Page Transitions (SPA)

```javascript
// GSAP-based page leave / enter
const pageTransition = {
  leave(container) {
    return gsap.to(container, {
      opacity: 0,
      y: -30,
      duration: 0.4,
      ease: 'power2.in',
    });
  },
  enter(container) {
    return gsap.from(container, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power3.out',
    });
  }
};

// Overlay wipe transition
function wipeTransition() {
  const tl = gsap.timeline();
  tl.to('.page-wipe', { scaleX: 1, transformOrigin: 'left', duration: 0.5, ease: 'power3.inOut' })
    .to('.page-wipe', { scaleX: 0, transformOrigin: 'right', duration: 0.5, ease: 'power3.inOut' });
  return tl;
}
```

**Framer Motion (React)**

```jsx
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -24, transition: { duration: 0.3 } },
};

// Wrap router outlet
<AnimatePresence mode="wait">
  <motion.div key={pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
</AnimatePresence>
```

---

## 4. Full Motion Architecture (Site-Level)

### 4.1 Motion Layers

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 5  │  WebGL / Canvas  │  3-D scenes, particles   │
├───────────┼──────────────────┼────────────────────────  │
│  LAYER 4  │  SVG / Lottie    │  Illustrations, icons     │
├───────────┼──────────────────┼────────────────────────  │
│  LAYER 3  │  GSAP Timelines  │  Hero, section sequences  │
├───────────┼──────────────────┼────────────────────────  │
│  LAYER 2  │  ScrollTrigger   │  Parallax, reveals, pins  │
├───────────┼──────────────────┼────────────────────────  │
│  LAYER 1  │  CSS Transitions │  Hover, focus, toggles    │
└─────────────────────────────────────────────────────────┘
  → Build from bottom up. Only add upper layers when justified.
```

### 4.2 Motion Token System

Define all motion values as CSS custom properties at `:root` level.

```css
:root {
  /* Durations */
  --dur-xs:  80ms;
  --dur-sm:  150ms;
  --dur-md:  300ms;
  --dur-lg:  600ms;
  --dur-xl:  1000ms;
  --dur-2xl: 1500ms;

  /* Easings */
  --ease-default:  cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in:       cubic-bezier(0.4, 0, 1, 1);
  --ease-out:      cubic-bezier(0, 0, 0.2, 1);
  --ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-expo-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-cinematic:cubic-bezier(0.76, 0, 0.24, 1);

  /* Distances */
  --motion-y-sm:  16px;
  --motion-y-md:  40px;
  --motion-y-lg:  80px;
}
```

---

## 5. Component Patterns

### 5.1 Animated Navigation

```css
/* Underline slide indicator */
.nav-link {
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0;
  width: 100%; height: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform var(--dur-md) var(--ease-expo-out);
}
.nav-link:hover::after,
.nav-link.active::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* Hamburger → X morphing */
.burger-line {
  transition: transform var(--dur-md) var(--ease-expo-out),
              opacity var(--dur-sm) ease;
}
.nav-open .burger-line:nth-child(1) { transform: translateY(8px) rotate(45deg); }
.nav-open .burger-line:nth-child(2) { opacity: 0; }
.nav-open .burger-line:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
```

### 5.2 Card Hover (3-D Tilt)

```javascript
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 → 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 14,
      rotateX: -y * 14,
      transformPerspective: 800,
      duration: 0.4,
      ease: 'power2.out',
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
  });
});
```

### 5.3 Loading / Preloader

```html
<div class="preloader" id="preloader">
  <div class="preloader-bar"></div>
</div>
```

```javascript
const preloaderTimeline = gsap.timeline();

// Simulate loading
preloaderTimeline
  .to('.preloader-bar', { scaleX: 0.7, duration: 1.2, ease: 'power1.out' })
  .to('.preloader-bar', { scaleX: 1,   duration: 0.4, ease: 'power2.in' })
  .to('#preloader',     { yPercent: -100, duration: 0.8, ease: 'power3.inOut', delay: 0.1 })
  .from('body > *',     { opacity: 0, y: 20, stagger: 0.1, duration: 0.5 }, '-=0.3');
```

### 5.4 Text Effects

```css
/* Gradient text animation */
.gradient-text {
  background: linear-gradient(90deg, #6c63ff, #ff6584, #43cbff);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 4s linear infinite;
}
@keyframes gradient-shift {
  to { background-position: 200% center; }
}

/* Glitch effect */
.glitch {
  position: relative;
}
.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0; left: 0;
  width: 100%;
}
.glitch::before {
  color: #ff004c;
  animation: glitch-1 2s infinite linear;
  clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%);
}
.glitch::after {
  color: #00d4ff;
  animation: glitch-2 2s infinite linear;
  clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
}
@keyframes glitch-1 {
  0%,100% { transform: translate(0); }
  20%      { transform: translate(-3px, 1px); }
  40%      { transform: translate(3px, -1px); }
}
@keyframes glitch-2 {
  0%,100% { transform: translate(0); }
  20%      { transform: translate(3px, 1px); }
  40%      { transform: translate(-3px, -1px); }
}
```

---

## 6. Performance Rules

### 6.1 GPU-Accelerated Properties Only

Animate ONLY these properties for 60 fps:

| ✅ Safe (GPU composited) | ❌ Avoid (triggers layout) |
|--------------------------|----------------------------|
| `transform: translate/rotate/scale` | `top`, `left`, `right`, `bottom` |
| `opacity` | `width`, `height` |
| `filter` (blur, brightness) | `margin`, `padding` |
| `clip-path` | `font-size` |

```css
/* Always set will-change on animated elements */
.animated-card {
  will-change: transform, opacity;
}
/* Remove will-change after animation completes */
```

### 6.2 requestAnimationFrame Patterns

```javascript
// Smooth lerp loop (cursor, parallax, etc.)
let current = 0, target = 0;

function lerp(a, b, factor) {
  return a + (b - a) * factor;
}

function loop() {
  current = lerp(current, target, 0.1);
  element.style.transform = `translateY(${current}px)`;
  requestAnimationFrame(loop);
}
loop();
```

### 6.3 Reduce DOM Queries

```javascript
// Cache all GSAP targets at init — never query inside animation loop
const cache = {
  title:  document.querySelector('.hero-title'),
  cards:  gsap.utils.toArray('.card'),
  lines:  gsap.utils.toArray('.section-line'),
};
```

### 6.4 Bundle Impact Budget

| Library | Gzipped size | Load strategy |
|---------|-------------|---------------|
| GSAP core | ~24 KB | Always async, defer |
| ScrollTrigger | +10 KB | Lazy-import on scroll start |
| Three.js | ~160 KB | Dynamic import, only when canvas is in viewport |
| Lottie | ~60 KB | Load after `DOMContentLoaded` |
| Framer Motion | ~50 KB | Tree-shaken via named imports |

```javascript
// Lazy-load Three.js
const canvas = document.querySelector('#webgl');
if (canvas) {
  import('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js')
    .then(({ default: THREE }) => initScene(THREE));
}
```

---

## 7. Accessibility

### 7.1 Respect `prefers-reduced-motion`

This is **non-negotiable**. Every motion-heavy site must implement this.

```css
/* Disable all animations for motion-sensitive users */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

```javascript
// GSAP global override
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.globalTimeline.timeScale(100); // or gsap.defaults({ duration: 0 });
}

// React / Framer Motion
import { useReducedMotion } from 'framer-motion';

function AnimatedHero() {
  const shouldReduce = useReducedMotion();
  return (
    <motion.div
      animate={{ opacity: 1, y: shouldReduce ? 0 : 40 }}
      initial={{ opacity: 0, y: shouldReduce ? 0 : 40 }}
    />
  );
}
```

### 7.2 Pause Mechanisms

```javascript
// Auto-playing animations MUST have pause controls
const loopAnim = gsap.to('.loop-element', { rotation: 360, repeat: -1, ease: 'linear', duration: 4 });

document.querySelector('.pause-btn').addEventListener('click', () => {
  loopAnim.paused() ? loopAnim.resume() : loopAnim.pause();
});
```

### 7.3 Focus & Keyboard

Animated elements that are interactive must retain visible focus rings. Never hide `:focus-visible` on motion-enhanced components.

---

## 8. Site Type Templates

### 8.1 Agency / Portfolio

- **Hero:** Full-screen WebGL or video + SplitText title entrance
- **Work grid:** 3-D tilt cards, hover-crop reveal, custom cursor scale
- **Transitions:** Page wipe or iris reveal between projects
- **Signature move:** Magnetic nav links, cursor-tracking gradient

### 8.2 SaaS / Product

- **Hero:** Dashboard mock-up animation (typewriter + UI build-up)
- **Features:** Scroll-pinned horizontal feature tour
- **Social proof:** Number roll-up counters, logo ticker marquee
- **Signature move:** Interactive demo component with motion feedback

### 8.3 Landing Page / Campaign

- **Hero:** Particle system + bold headline entrance
- **Sections:** Staggered fade-in with scroll scrub
- **CTA:** Pulse ring animation on primary button
- **Signature move:** Countdown timer with digit flip animation

### 8.4 Portfolio / Creative

- **Hero:** SVG blob morph background + character split reveal
- **Gallery:** Masonry with hover video play + custom cursor
- **About:** Timeline scrub with drawing-on SVG path
- **Signature move:** Scroll-speed-modulated parallax depth layers

---

## 9. Full HTML Boilerplate

Copy this as the starting shell for any motion-graphics HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Motion Site</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --c-bg:      #0a0a0f;
      --c-surface: #13131a;
      --c-accent:  #6c63ff;
      --c-text:    #f0f0f8;

      --dur-sm: 150ms;
      --dur-md: 300ms;
      --dur-lg: 600ms;
      --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
      --ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    html { scroll-behavior: smooth; }
    body { background: var(--c-bg); color: var(--c-text); font-family: system-ui, sans-serif; overflow-x: hidden; }

    /* Reduced-motion safety net */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
      }
    }

    /* Preloader */
    #preloader {
      position: fixed; inset: 0; z-index: 9999;
      background: var(--c-bg);
      display: flex; align-items: center; justify-content: center;
    }
    .preloader-bar {
      width: 200px; height: 2px;
      background: var(--c-accent);
      transform-origin: left;
      transform: scaleX(0);
    }

    /* Reveal utility */
    .reveal { opacity: 0; transform: translateY(40px); }
  </style>
</head>
<body>

  <div id="preloader"><div class="preloader-bar"></div></div>

  <!-- Site content here -->
  <main id="main" style="visibility:hidden">
    <!-- ... -->
  </main>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
  <script>
    window.addEventListener('DOMContentLoaded', () => {
      gsap.registerPlugin(ScrollTrigger);

      // Preloader
      const tl = gsap.timeline({ onComplete: initSite });
      tl.to('.preloader-bar', { scaleX: 1, duration: 0.8, ease: 'power1.inOut' })
        .to('#preloader',     { yPercent: -100, duration: 0.6, ease: 'power3.inOut' })
        .set('#main', { visibility: 'visible' });

      function initSite() {
        // Scroll reveals
        ScrollTrigger.batch('.reveal', {
          onEnter: els => gsap.to(els, { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out' }),
          once: true,
        });
      }
    });
  </script>
</body>
</html>
```

---

## 10. Quality Checklist

Before shipping any motion-graphics website, verify every item:

### Motion Quality
- [ ] Hero entrance uses a **staggered timeline** (not simultaneous fades)
- [ ] All animations use GPU-safe properties only (`transform`, `opacity`)
- [ ] Easing curves match the brand personality (spring for playful, expo for crisp)
- [ ] No two sections use the same entrance animation
- [ ] Scroll animations have a `once: true` flag (or intentional repeat)
- [ ] Loop animations have a visible pause/stop control

### Performance
- [ ] Lighthouse Performance score ≥ 85 on mobile
- [ ] No layout-triggering properties animated (`top`, `width`, `margin`)
- [ ] Heavy libraries (Three.js, Lottie) are lazy-loaded
- [ ] `will-change` set on animated elements, removed after completion
- [ ] Canvas/WebGL renderer pixel ratio capped at `Math.min(dpr, 2)`

### Accessibility
- [ ] `@media (prefers-reduced-motion: reduce)` disables or minimizes all animations
- [ ] Auto-playing motion has a pause control
- [ ] Animated interactive elements retain visible `:focus-visible` ring
- [ ] Flashing effects are ≤ 3 Hz (no seizure risk)
- [ ] Color is not the sole carrier of animated meaning

### Cross-browser / Responsive
- [ ] Tested at 320 px, 768 px, 1440 px, 2560 px
- [ ] Three.js / canvas falls back gracefully if WebGL unsupported
- [ ] Touch events handled for mobile scroll triggers
- [ ] No horizontal overflow from motion transforms

---

*End of MOTION_GRAPHICS_SKILL.md — version 1.0.0*
