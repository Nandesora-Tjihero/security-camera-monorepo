<template>
  <svg
    width="400"
    height="300"
    viewBox="0 0 400 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <!-- Gradient -->
      <linearGradient
        id="curveGradient"
        x1="0"
        y1="0"
        x2="400"
        y2="300"
        gradientUnits="userSpaceOnUse"
      >
        <stop
          offset="0%"
          stop-color="#39BEF8"
        />
        <stop
          offset="100%"
          stop-color="#F839BE"
        />
      </linearGradient>

      <!-- Arrowhead marker with two separate paths -->
      <marker
        id="arrow"
        markerWidth="10"
        markerHeight="10"
        refX="6"
        refY="4"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path
          class="arrow-line arrow-line-1"
          d="M6,4 L0,1"
          fill="none"
          stroke="url(#curveGradient)"
          stroke-width="1"
          stroke-linecap="round"
        />
        <path
          class="arrow-line arrow-line-2"
          d="M6,4 L0,7"
          fill="none"
          stroke="url(#curveGradient)"
          stroke-width="1"
          stroke-linecap="round"
        />
      </marker>
    </defs>

    <!-- Curved path with animation -->
    <path
      class="animated-arrow"
      d="M 20 50 
           C 150 40, 200 120, 180 180 
           S 350 250, 380 250"
      stroke="url(#curveGradient)"
      stroke-width="8"
      fill="none"
      stroke-linecap="round"
      marker-end="url(#arrow)"
    />
  </svg>
</template>
<style scoped>
  /* Animate the main curve being drawn */
  .animated-arrow {
    stroke-dasharray: 600;
    stroke-dashoffset: 600;
    animation: draw-path 2s ease forwards;
  }

  /* Animate the two arrowhead lines */
  .arrow-line {
    stroke-dasharray: 10;
    stroke-dashoffset: 10;
    animation: draw-arrow 0.3s ease forwards;
    animation-delay: 1s; /* wait until curve finishes */
  }

  .arrow-line-2 {
    animation-delay: 1.15s; /* slight stagger for natural feel */
  }

  @keyframes draw-path {
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes draw-arrow {
    to {
      stroke-dashoffset: 0;
    }
  }
</style>
