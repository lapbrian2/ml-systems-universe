# ML Systems Universe

An unofficial, interactive companion for the open-source **CS249r: Machine Learning Systems** textbook by Prof. Vijay Janapa Reddi et al. (Harvard University).

> **Disclaimer:** This project is **not affiliated with, endorsed by, or officially connected to Harvard University** or the CS249r teaching team. "CS249r" is used solely to identify the course whose open-source textbook this work is based on.

## What is this?

A scrollytelling web experience that brings the 21 chapters of the [CS249r textbook](https://mlsysbook.ai/) to life with:

- **Interactive visualizations** -- neural network playgrounds, adversarial attack simulators, carbon calculators, and more
- **Scroll-driven animations** -- GSAP ScrollTrigger-powered continuous animations that respond to scroll position
- **Guided tours** -- step-by-step spotlight overlays for complex viz components
- **Interactive equations** -- KaTeX equations with parameter sliders that update live
- **Inline mini-viz** -- small SVG widgets (activation functions, gradient flow, confusion matrices, distributions)
- **Quizzes & progress tracking** -- chapter quizzes, section-level progress, spaced repetition flashcards
- **10 interactive SVG infographics** -- GPU memory hierarchy, Transformer architecture, deployment patterns, and more
- **Touch gestures** -- pinch-zoom, pan, and double-tap support for mobile

## Stack

- **Nuxt 3** + **Vue 3** + **TypeScript**
- **TresJS** (Three.js for Vue) -- 3D visualizations
- **GSAP** + **ScrollTrigger** + **Lenis** -- animations and smooth scroll
- **Tailwind CSS 3** -- styling
- **Pinia** -- state management
- **KaTeX** -- math rendering
- **Pyodide** -- browser-side Python execution
- **canvas-confetti** -- achievement celebrations

## Getting started

```bash
npm install
npm run dev
```

## Attribution

This project is a derivative work based on:

- **Textbook:** [Machine Learning Systems](https://mlsysbook.ai/) by Prof. Vijay Janapa Reddi et al.
- **Course:** CS249r: Machine Learning Systems, Harvard University
- **Original license:** [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## License

This work is licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). See [LICENSE](./LICENSE) for details.
