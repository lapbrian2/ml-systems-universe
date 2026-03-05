<template>
  <div class="morphing-blobs" aria-hidden="true">
    <div class="morphing-blob morphing-blob--teal" />
    <div class="morphing-blob morphing-blob--purple" />
    <div class="morphing-blob morphing-blob--pink" />
  </div>
</template>

<style scoped>
.morphing-blobs {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.morphing-blob {
  position: absolute;
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  will-change: filter, border-radius;
  transform: translateZ(0);
}

/* ── Teal blob ── */
.morphing-blob--teal {
  width: 480px;
  height: 480px;
  background: #14b8a6;
  opacity: 0.08;
  filter: blur(100px);
  top: -120px;
  right: 5%;
  animation: morphA 20s infinite;
}

/* ── Purple blob ── */
.morphing-blob--purple {
  width: 420px;
  height: 420px;
  background: #a855f7;
  opacity: 0.06;
  filter: blur(120px);
  bottom: -80px;
  left: -5%;
  animation: morphB 25s infinite;
}

/* ── Pink blob ── */
.morphing-blob--pink {
  width: 350px;
  height: 350px;
  background: #ec4899;
  opacity: 0.07;
  filter: blur(90px);
  top: 40%;
  left: 55%;
  animation: morphC 18s infinite;
}

/* ── Morph keyframes ── */
@keyframes morphA {
  0%   { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
  25%  { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
  50%  { border-radius: 50% 60% 30% 60% / 50% 70% 30% 60%; }
  75%  { border-radius: 30% 40% 60% 70% / 60% 30% 50% 40%; }
  100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
}

@keyframes morphB {
  0%   { border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%; }
  20%  { border-radius: 30% 60% 70% 40% / 60% 40% 60% 30%; }
  40%  { border-radius: 50% 50% 40% 60% / 40% 70% 30% 60%; }
  60%  { border-radius: 70% 30% 60% 40% / 30% 50% 70% 50%; }
  80%  { border-radius: 40% 70% 50% 30% / 50% 30% 60% 70%; }
  100% { border-radius: 60% 40% 30% 70% / 50% 60% 40% 50%; }
}

@keyframes morphC {
  0%   { border-radius: 50% 50% 60% 40% / 60% 40% 50% 50%; }
  33%  { border-radius: 30% 70% 40% 60% / 50% 60% 30% 70%; }
  66%  { border-radius: 60% 40% 50% 50% / 30% 50% 70% 40%; }
  100% { border-radius: 50% 50% 60% 40% / 60% 40% 50% 50%; }
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  .morphing-blob {
    animation: none !important;
  }
}
</style>
