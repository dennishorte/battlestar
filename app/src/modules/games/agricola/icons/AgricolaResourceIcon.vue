<template>
  <svg
    class="agri-resource-icon"
    :class="`resource-${type}`"
    viewBox="0 0 24 24"
    :aria-label="type"
    role="img"
  >
    <!-- Wood: stacked log -->
    <g v-if="type === 'wood'">
      <ellipse cx="12"
               cy="8"
               rx="8"
               ry="3.2" />
      <path d="M4 8v6c0 1.8 3.6 3.2 8 3.2s8-1.4 8-3.2V8" />
      <ellipse cx="12"
               cy="14"
               rx="8"
               ry="3.2" />
      <ellipse cx="12"
               cy="8"
               rx="2.2"
               ry="1.1"
               class="detail" />
    </g>

    <!-- Clay: brick -->
    <g v-else-if="type === 'clay'">
      <rect x="3.5"
            y="6"
            width="17"
            height="12"
            rx="1.2" />
      <line x1="3.5"
            y1="12"
            x2="20.5"
            y2="12"
            class="detail" />
      <line x1="12"
            y1="6"
            x2="12"
            y2="12"
            class="detail" />
      <line x1="8"
            y1="12"
            x2="8"
            y2="18"
            class="detail" />
      <line x1="16"
            y1="12"
            x2="16"
            y2="18"
            class="detail" />
    </g>

    <!-- Reed: three stalks -->
    <g v-else-if="type === 'reed'">
      <path d="M7 20c0-6 1.2-11 2-14" fill="none" />
      <path d="M12 20c0-7 .8-12 1.5-15" fill="none" />
      <path d="M17 20c0-5.5-1-11-2.2-14.5" fill="none" />
      <path d="M8.2 7.2c1.4-.8 2.6-.4 2.8.6" fill="none" class="detail" />
      <path d="M13 6c1.5-.9 2.8-.3 3 .8" fill="none" class="detail" />
      <path d="M15.5 7.2c1.2-.7 2.4-.2 2.5.7" fill="none" class="detail" />
    </g>

    <!-- Stone: rock -->
    <g v-else-if="type === 'stone'">
      <path d="M5 15.5 8 7.5h5.5l5.5 4.2v5.3H6.2z" />
      <path d="M8 7.5 10.5 15.5" fill="none" class="detail" />
      <path d="M13.5 7.5 12 12.5" fill="none" class="detail" />
    </g>

    <!-- Food: bread loaf -->
    <g v-else-if="type === 'food'">
      <ellipse cx="12"
               cy="13.5"
               rx="8.5"
               ry="5" />
      <path d="M4.5 12.5c1.5-4 5-6.5 7.5-6.5s6 2.5 7.5 6.5" fill="none" />
      <path d="M8 11.5c.6-1.2 1.8-2 2.8-2" fill="none" class="detail" />
      <path d="M13 10c.8-.7 1.8-1 2.6-.8" fill="none" class="detail" />
    </g>

    <!-- Grain: wheat sheaf -->
    <g v-else-if="type === 'grain'">
      <line x1="12"
            y1="5"
            x2="12"
            y2="20"
            fill="none" />
      <path d="M12 8c-2.2-1.5-4.2-1.2-5 .2" fill="none" />
      <path d="M12 8c2.2-1.5 4.2-1.2 5 .2" fill="none" />
      <path d="M12 11.5c-2.4-1.4-4.5-1-5.2.4" fill="none" />
      <path d="M12 11.5c2.4-1.4 4.5-1 5.2.4" fill="none" />
      <path d="M12 15c-2.2-1.2-4-.8-4.6.4" fill="none" />
      <path d="M12 15c2.2-1.2 4-.8 4.6.4" fill="none" />
      <ellipse cx="12"
               cy="5.5"
               rx="1.3"
               ry="1.8" />
    </g>

    <!-- Vegetables: carrot -->
    <g v-else-if="type === 'vegetables'">
      <path d="M12 8.5c3.2 2.2 4.8 6 4.2 10.2-.2 1.2-1.5 1.8-2.5 1.2L12 18.5l-1.7 1.4c-1 .6-2.3 0-2.5-1.2C7.2 14.5 8.8 10.7 12 8.5z" />
      <path d="M10.5 8.2C9 6.2 8.2 4.5 9 3.5" fill="none" class="tops" />
      <path d="M12 7.8V3.2" fill="none" class="tops" />
      <path d="M13.5 8.2c1.5-2 2.3-3.7 1.5-4.7" fill="none" class="tops" />
    </g>

    <!-- Sheep -->
    <g v-else-if="type === 'sheep'">
      <ellipse cx="12"
               cy="13.5"
               rx="7.5"
               ry="5.2" />
      <circle cx="17.5" cy="10.5" r="2.8" />
      <circle cx="19.2"
              cy="10.2"
              r=".7"
              class="detail-fill" />
      <path d="M6.5 16.5v3M10 17.5v3M14 17.5v3M17 16.5v3" fill="none" class="detail" />
      <path d="M16.2 8.2 15 6.5M18.8 8.2 20 6.5" fill="none" class="detail" />
    </g>

    <!-- Boar -->
    <g v-else-if="type === 'boar'">
      <ellipse cx="11"
               cy="13"
               rx="7"
               ry="4.8" />
      <ellipse cx="17.5"
               cy="12.2"
               rx="3.2"
               ry="2.6" />
      <path d="M5.5 11.5 3.5 9.2M5.5 14.5 3.2 16" fill="none" />
      <circle cx="18.8"
              cy="11.5"
              r=".6"
              class="detail-fill" />
      <path d="M8 16.5v3.2M12.5 17v3M15.5 16.2v2.8" fill="none" class="detail" />
      <path d="M15.5 9.2 14.2 6.8M18.2 9 19.5 6.5" fill="none" />
    </g>

    <!-- Cattle -->
    <g v-else-if="type === 'cattle'">
      <ellipse cx="12"
               cy="14"
               rx="7.2"
               ry="4.5" />
      <circle cx="17.8" cy="11.5" r="3" />
      <path d="M15.5 9.2 13.2 5.5M19.8 9.2 21.5 5.8" fill="none" />
      <circle cx="19"
              cy="11.2"
              r=".55"
              class="detail-fill" />
      <path d="M7 17v3M11 17.8v2.8M14.5 17.5v2.8" fill="none" class="detail" />
      <ellipse cx="20.5"
               cy="13.2"
               rx="1.2"
               ry=".8" />
    </g>

    <!-- Fences -->
    <g v-else-if="type === 'fences'">
      <line x1="4"
            y1="8"
            x2="4"
            y2="18"
            fill="none" />
      <line x1="12"
            y1="7"
            x2="12"
            y2="18"
            fill="none" />
      <line x1="20"
            y1="8"
            x2="20"
            y2="18"
            fill="none" />
      <line x1="3"
            y1="10.5"
            x2="21"
            y2="10.5"
            fill="none" />
      <line x1="3"
            y1="15"
            x2="21"
            y2="15"
            fill="none" />
    </g>

    <!-- Stables -->
    <g v-else-if="type === 'stables'">
      <path d="M4 12 12 5l8 7" fill="none" />
      <path d="M6 11v8h12v-8" fill="none" />
      <rect x="10"
            y="14"
            width="4"
            height="5" />
    </g>

    <!-- Package fallback -->
    <g v-else>
      <rect x="4.5"
            y="7"
            width="15"
            height="12"
            rx="1" />
      <path d="M4.5 11h15M12 7v12" fill="none" class="detail" />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'AgricolaResourceIcon',

  props: {
    type: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.agri-resource-icon {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  display: inline-block;
  vertical-align: -.15em;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.agri-resource-icon path,
.agri-resource-icon ellipse,
.agri-resource-icon circle,
.agri-resource-icon rect,
.agri-resource-icon line {
  stroke-width: 1.5;
}

.agri-resource-icon .detail {
  stroke-width: 1.1;
  opacity: 0.7;
}

.agri-resource-icon .detail-fill {
  fill: #3e2723;
  stroke: none;
}

.resource-wood {
  fill: #bcaaa4;
  stroke: #5d4037;
}

.resource-clay {
  fill: #ffab91;
  stroke: #bf360c;
}

.resource-reed {
  fill: none;
  stroke: #2e7d32;
}

.resource-reed .detail {
  stroke: #66bb6a;
}

.resource-stone {
  fill: #b0bec5;
  stroke: #455a64;
}

.resource-food {
  fill: #ffe082;
  stroke: #ef6c00;
}

.resource-grain {
  fill: #fbc02d;
  stroke: #f57f17;
}

.resource-vegetables {
  fill: #fb8c00;
  stroke: #e65100;
}

.resource-vegetables .tops {
  fill: none;
  stroke: #2e7d32;
}

.resource-sheep {
  fill: #fafafa;
  stroke: #616161;
}

.resource-boar {
  fill: #8d6e63;
  stroke: #4e342e;
}

.resource-cattle {
  fill: #a1887f;
  stroke: #4e342e;
}

.resource-fences,
.resource-stables {
  fill: none;
  stroke: #5d4037;
}

.resource-stables rect {
  fill: #8d6e63;
  stroke: #5d4037;
}

.resource-package {
  fill: #fff3e0;
  stroke: #ef6c00;
}
</style>
