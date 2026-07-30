<template>
  <svg
    class="agri-action-icon"
    :class="`action-${type}`"
    viewBox="0 0 24 24"
    :aria-label="type"
    role="img"
  >
    <!-- Farm Expansion: house with plus -->
    <g v-if="type === 'expansion'">
      <path d="M3.5 11.5 12 4l8.5 7.5" />
      <path d="M6 10.5V19h5.5v-5H14v5h4V10.5" />
      <path d="M18.5 4v5M16 6.5h5" />
    </g>

    <!-- Meeting Place: two figures + token -->
    <g v-else-if="type === 'meeting'">
      <circle cx="8" cy="7.5" r="2.2" />
      <path d="M4.5 17c.4-3.2 1.8-4.8 3.5-4.8S11.1 13.8 11.5 17" />
      <circle cx="16" cy="7.5" r="2.2" />
      <path d="M12.5 17c.4-3.2 1.8-4.8 3.5-4.8s3.1 1.6 3.5 4.8" />
      <circle cx="12"
              cy="19.5"
              r="1.6"
              class="fill" />
    </g>

    <!-- Grain Seeds -->
    <g v-else-if="type === 'grain-seeds'">
      <line x1="12"
            y1="4.5"
            x2="12"
            y2="19.5" />
      <path d="M12 7.5c-2.3-1.4-4.3-1.1-5 .3" />
      <path d="M12 7.5c2.3-1.4 4.3-1.1 5 .3" />
      <path d="M12 11.5c-2.5-1.3-4.6-.9-5.3.4" />
      <path d="M12 11.5c2.5-1.3 4.6-.9 5.3.4" />
      <path d="M12 15.5c-2.2-1.1-4-.7-4.6.4" />
      <path d="M12 15.5c2.2-1.1 4-.7 4.6.4" />
      <ellipse cx="12"
               cy="5"
               rx="1.2"
               ry="1.6"
               class="fill" />
    </g>

    <!-- Plow / Farmland -->
    <g v-else-if="type === 'plow'">
      <path d="M4 16.5h10.5" />
      <path d="M14.5 16.5c2.2 0 4.5-1.8 4.5-4.2 0-1.6-1-2.8-2.4-3.2" />
      <path d="M6.5 16.5 5 8.5h3l1.2 8" />
      <path d="M4 19h16" />
      <path d="M8 19v1.5M12 19v1.5M16 19v1.5" />
    </g>

    <!-- Occupation / Lessons: open book -->
    <g v-else-if="type === 'occupation'">
      <path d="M12 7.5c-2.2-1.8-5.2-2.2-7.5-1.6v11c2.5-.5 5.2 0 7.5 1.8 2.3-1.8 5-2.3 7.5-1.8v-11c-2.3-.6-5.3-.2-7.5 1.6z" />
      <path d="M12 7.5v11" />
      <path d="M6.5 10.5h3.5M6.5 13h3.5M14 10.5h3.5M14 13h3.5" />
    </g>

    <!-- Day Laborer: figure with shovel -->
    <g v-else-if="type === 'laborer'">
      <circle cx="10" cy="6.5" r="2.2" />
      <path d="M6.5 19c.5-4 2-6 3.5-6s3 2 3.5 6" />
      <path d="M13.5 11.5 18 7" />
      <path d="M16.5 5.5h4.2v3.2L18 11z" class="fill" />
    </g>

    <!-- Forest / Copse / Grove -->
    <g v-else-if="type === 'forest'">
      <path d="M7 18.5 10 8l3 10.5" class="fill" />
      <path d="M13 18.5 16.5 6.5 20 18.5" class="fill" />
      <line x1="10"
            y1="14"
            x2="10"
            y2="20" />
      <line x1="16.5"
            y1="13"
            x2="16.5"
            y2="20" />
      <path d="M4.5 18.5 7.5 10l3 8.5" />
    </g>

    <!-- Clay Pit / Hollow -->
    <g v-else-if="type === 'clay-pit'">
      <path d="M3.5 15c2-4.5 5-7 8.5-7s6.5 2.5 8.5 7" />
      <path d="M5 15h14v3.5H5z" class="fill" />
      <path d="M8 12.5c1-.8 2.2-1.2 3.5-1.2" />
      <rect x="7"
            y="16"
            width="4"
            height="1.8"
            rx=".3" />
      <rect x="13"
            y="16"
            width="4"
            height="1.8"
            rx=".3" />
    </g>

    <!-- Reed Bank -->
    <g v-else-if="type === 'reed-bank'">
      <path d="M5 19c1-7 2-12 3.2-15" />
      <path d="M10 19c.5-8 1.5-13 2.5-15.5" />
      <path d="M15 19c-.2-6.5-1.5-12-3-15" />
      <path d="M19 19c-1-6-2.5-11-4-14" />
      <path d="M7.5 6c1.2-.7 2.2-.2 2.4.7" />
      <path d="M12 5c1.3-.8 2.4-.2 2.6.8" />
      <path d="M3 19.5h18" />
    </g>

    <!-- Fishing -->
    <g v-else-if="type === 'fishing'">
      <path d="M4 12c3.5-4.5 8-5.5 12-3.5 1.8.9 3.2 2.2 4.2 3.5-1 1.3-2.4 2.6-4.2 3.5-4 2-8.5 1-12-3.5z" class="fill" />
      <path d="M16 12h4.5l2-2.5L20.5 12l2 2.5H16" />
      <circle cx="8.5"
              cy="11.2"
              r="1"
              class="eye" />
      <path d="M3 16.5c2 .8 4 .8 6 0s4-.8 6 0" />
    </g>

    <!-- Sow and/or Bake -->
    <g v-else-if="type === 'sow-bake'">
      <path d="M4.5 14.5c0-3.2 2.2-5.5 4.5-5.5s4.5 2.3 4.5 5.5" class="fill" />
      <path d="M5 14.5h8v3.5c0 1-1.5 1.8-4 1.8s-4-.8-4-1.8z" />
      <line x1="15.5"
            y1="6"
            x2="15.5"
            y2="18" />
      <path d="M15.5 8c-1.8-1.2-3.2-.9-3.6.3" />
      <path d="M15.5 8c1.8-1.2 3.2-.9 3.6.3" />
      <path d="M15.5 11.5c-1.8-1-3.2-.7-3.6.3" />
      <path d="M15.5 11.5c1.8-1 3.2-.7 3.6.3" />
      <ellipse cx="15.5"
               cy="6.2"
               rx="1"
               ry="1.3"
               class="fill" />
    </g>

    <!-- Sheep (market) -->
    <g v-else-if="type === 'sheep'">
      <ellipse cx="11.5"
               cy="13.5"
               rx="7"
               ry="4.8"
               class="fill" />
      <circle cx="17"
              cy="10.8"
              r="2.6"
              class="fill" />
      <circle cx="18.5" cy="10.5" r=".55" />
      <path d="M6.5 16.2v2.8M10 17v2.5M13.5 17v2.5M16.5 16v2.5" />
      <path d="M15.8 8.5 14.8 6.8M18.2 8.5 19.2 6.8" />
    </g>

    <!-- Fencing -->
    <g v-else-if="type === 'fencing'">
      <line x1="5"
            y1="6.5"
            x2="5"
            y2="18.5" />
      <line x1="12"
            y1="5.5"
            x2="12"
            y2="18.5" />
      <line x1="19"
            y1="6.5"
            x2="19"
            y2="18.5" />
      <line x1="3.5"
            y1="9.5"
            x2="20.5"
            y2="9.5" />
      <line x1="3.5"
            y1="14.5"
            x2="20.5"
            y2="14.5" />
    </g>

    <!-- Major/Minor Improvement: hammer + anvil -->
    <g v-else-if="type === 'improvement'">
      <path d="M8 14.5 14.5 8l2.2 2.2-6.5 6.5z" class="fill" />
      <path d="M14.5 8c1.2-1.8 3.2-2.5 4.8-1.8 1 .4 1.5 1.5 1.2 2.5-.5 1.6-2.2 2.5-3.8 2" />
      <path d="M5 19.5h10" />
      <path d="M7 19.5v-3h6v3" />
    </g>

    <!-- Family Growth -->
    <g v-else-if="type === 'family'">
      <circle cx="8" cy="7" r="2" />
      <path d="M4.8 17c.4-3 1.7-4.5 3.2-4.5S11.1 14 11.5 17" />
      <circle cx="16.5" cy="7" r="2" />
      <path d="M13.2 17c.4-3 1.7-4.5 3.3-4.5s2.9 1.5 3.3 4.5" />
      <circle cx="12" cy="11.5" r="1.6" />
      <path d="M9.8 18.5c.3-2.2 1.2-3.3 2.2-3.3s1.9 1.1 2.2 3.3" />
    </g>

    <!-- Quarry / Stone -->
    <g v-else-if="type === 'quarry'">
      <path d="M3.5 17 8 7.5h4.5L17 12l3.5 5z" class="fill" />
      <path d="M8 7.5 10 17M12.5 7.5 12 13" />
      <path d="M4 19.5h16" />
    </g>

    <!-- Renovation: house with hammer -->
    <g v-else-if="type === 'renovation'">
      <path d="M3 12 10.5 5.5 18 12" />
      <path d="M5.5 10.8V18h10V10.8" />
      <rect x="8.5"
            y="13"
            width="3.5"
            height="5" />
      <path d="M16 7.5 20.5 3" />
      <path d="M18.5 2h3.5v3.2L19.5 8z" class="fill" />
    </g>

    <!-- Vegetable Seeds -->
    <g v-else-if="type === 'vegetable-seeds'">
      <path d="M12 8c3 2 4.5 5.5 4 9.5-.2 1.1-1.4 1.6-2.3 1.1L12 17.5l-1.7 1.1c-.9.5-2.1 0-2.3-1.1C7.5 13.5 9 10 12 8z" class="fill" />
      <path d="M10.5 8C9 6 8.2 4.5 9 3.5" />
      <path d="M12 7.5V3" />
      <path d="M13.5 8c1.5-2 2.3-3.5 1.5-4.5" />
    </g>

    <!-- Boar -->
    <g v-else-if="type === 'boar'">
      <ellipse cx="11"
               cy="13"
               rx="6.5"
               ry="4.5"
               class="fill" />
      <ellipse cx="17.2"
               cy="12.2"
               rx="3"
               ry="2.4"
               class="fill" />
      <path d="M5.8 11.5 4 9.5M5.8 14.5 3.8 16" />
      <circle cx="18.5" cy="11.5" r=".55" />
      <path d="M8 16.2v2.8M12 16.8v2.5M15 16v2.5" />
      <path d="M15.2 9.2 14 7M17.8 9 19 6.8" />
    </g>

    <!-- Cattle -->
    <g v-else-if="type === 'cattle'">
      <ellipse cx="11.5"
               cy="14"
               rx="6.8"
               ry="4.2"
               class="fill" />
      <circle cx="17.5"
              cy="11.5"
              r="2.8"
              class="fill" />
      <path d="M15.2 9.2 13 5.8M19.5 9.2 21.2 6" />
      <circle cx="18.6" cy="11.2" r=".5" />
      <path d="M7 17v2.8M11 17.5v2.5M14.5 17.2v2.5" />
      <ellipse cx="20"
               cy="13"
               rx="1.1"
               ry=".7"
               class="fill" />
    </g>

    <!-- Cultivation: plow + seed -->
    <g v-else-if="type === 'cultivation'">
      <path d="M3.5 15.5h8" />
      <path d="M11.5 15.5c1.8 0 3.5-1.4 3.5-3.2 0-1.2-.8-2.2-1.8-2.5" />
      <path d="M5.5 15.5 4.5 9h2.5l.8 6.5" />
      <path d="M3.5 18.5h10" />
      <line x1="17.5"
            y1="5.5"
            x2="17.5"
            y2="16" />
      <path d="M17.5 7.5c-1.6-1-2.8-.7-3.2.3" />
      <path d="M17.5 7.5c1.6-1 2.8-.7 3.2.3" />
      <path d="M17.5 11c-1.5-.9-2.7-.6-3.1.3" />
      <path d="M17.5 11c1.5-.9 2.7-.6 3.1.3" />
      <ellipse cx="17.5"
               cy="5.8"
               rx=".9"
               ry="1.2"
               class="fill" />
    </g>

    <!-- Resource Market -->
    <g v-else-if="type === 'market'">
      <path d="M4 9.5 6.5 5h11L20 9.5z" class="fill" />
      <path d="M5.5 9.5V19h13V9.5" />
      <path d="M9 13h6v6H9z" />
      <line x1="4"
            y1="9.5"
            x2="20"
            y2="9.5" />
      <path d="M7.5 5 6 9.5M12 5v4.5M16.5 5 18 9.5" />
    </g>

    <!-- Traveling Players -->
    <g v-else-if="type === 'traveling'">
      <circle cx="9" cy="7" r="2" />
      <path d="M5.8 17.5c.4-3.2 1.8-4.8 3.2-4.8s2.8 1.6 3.2 4.8" />
      <path d="M13 10c1.5 0 3 .8 4 2.2l2.5-1.2" />
      <path d="M17.5 9.5c1.2.3 2.2 1.2 2.8 2.5" />
      <circle cx="19.5"
              cy="14.5"
              r="1.3"
              class="fill" />
      <path d="M14.5 18.5c2-.5 3.5-1.5 4.5-3" />
      <path d="M4 19.5h8" />
    </g>

    <!-- House Building -->
    <g v-else-if="type === 'house'">
      <path d="M3.5 11.5 12 4l8.5 7.5" />
      <path d="M6 10.5V19h12v-8.5" />
      <rect x="10"
            y="13.5"
            width="4"
            height="5.5"
            class="fill" />
      <path d="M8 8.5V6h2.5" />
    </g>

    <!-- Riverbank Forest: tree + wave -->
    <g v-else-if="type === 'riverbank'">
      <path d="M10 14.5 13.5 5 17 14.5" class="fill" />
      <line x1="13.5"
            y1="11"
            x2="13.5"
            y2="17" />
      <path d="M6 14.5 9 7.5l3 7" />
      <path d="M4 19c2 .8 3.5.8 5.5 0s3.5-.8 5.5 0 3.5.8 5.5 0" />
    </g>

    <!-- Animal Market -->
    <g v-else-if="type === 'animal-market'">
      <ellipse cx="8"
               cy="14.5"
               rx="4.2"
               ry="3"
               class="fill" />
      <circle cx="11.2"
              cy="12.5"
              r="1.8"
              class="fill" />
      <ellipse cx="16.5"
               cy="14"
               rx="4"
               ry="2.8"
               class="fill" />
      <circle cx="19.5"
              cy="12.2"
              r="1.7"
              class="fill" />
      <path d="M5.5 16.5v2M8.5 17v2M14.5 16v2M17.5 16.2v2" />
      <path d="M4 8.5h16" />
      <path d="M6 8.5 7.5 5h9L18 8.5" />
    </g>

    <!-- Farm Supplies: grain sack -->
    <g v-else-if="type === 'farm-supplies'">
      <path d="M8 8.5c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5" />
      <path d="M7 9.5c0 6 1.5 10 5 10s5-4 5-10z" class="fill" />
      <path d="M9.5 13h5M10 16h4" />
      <ellipse cx="12"
               cy="8.5"
               rx="4"
               ry="1.5" />
    </g>

    <!-- Building Supplies: stacked materials -->
    <g v-else-if="type === 'building-supplies'">
      <rect x="4"
            y="14.5"
            width="16"
            height="4"
            rx=".6"
            class="fill" />
      <rect x="5.5"
            y="10"
            width="13"
            height="4"
            rx=".6"
            class="fill" />
      <rect x="7"
            y="5.5"
            width="10"
            height="4"
            rx=".6"
            class="fill" />
      <line x1="4"
            y1="16.5"
            x2="20"
            y2="16.5" />
      <line x1="5.5"
            y1="12"
            x2="18.5"
            y2="12" />
    </g>

    <!-- Corral: pen -->
    <g v-else-if="type === 'corral'">
      <rect x="4"
            y="6"
            width="16"
            height="13"
            rx="1" />
      <line x1="4"
            y1="10.5"
            x2="20"
            y2="10.5" />
      <line x1="4"
            y1="15"
            x2="20"
            y2="15" />
      <line x1="8"
            y1="6"
            x2="8"
            y2="19" />
      <line x1="12"
            y1="6"
            x2="12"
            y2="19" />
      <line x1="16"
            y1="6"
            x2="16"
            y2="19" />
      <ellipse cx="12"
               cy="14"
               rx="2.2"
               ry="1.5"
               class="fill" />
    </g>

    <!-- Side Job: stable + bread -->
    <g v-else-if="type === 'side-job'">
      <path d="M3.5 11 9 6l5.5 5" />
      <path d="M5 10.2V17h8v-6.8" />
      <rect x="7.5"
            y="12.5"
            width="3"
            height="4.5"
            class="fill" />
      <ellipse cx="18"
               cy="14.5"
               rx="3.8"
               ry="2.4"
               class="fill" />
      <path d="M14.8 13.5c.8-2 2.2-3.2 3.2-3.2s2.4 1.2 3.2 3.2" />
    </g>

    <!-- Card-provided / fallback -->
    <g v-else>
      <rect x="5.5"
            y="3.5"
            width="13"
            height="17"
            rx="1.5" />
      <line x1="8.5"
            y1="8"
            x2="15.5"
            y2="8" />
      <line x1="8.5"
            y1="11.5"
            x2="15.5"
            y2="11.5" />
      <line x1="8.5"
            y1="15"
            x2="13"
            y2="15" />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'AgricolaActionIcon',

  props: {
    type: {
      type: String,
      required: true,
    },
  },
}
</script>

<style scoped>
.agri-action-icon {
  width: 1.15em;
  height: 1.15em;
  flex-shrink: 0;
  display: inline-block;
  vertical-align: -.2em;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
  color: #5d4037;
}

.agri-action-icon .fill {
  fill: currentColor;
  fill-opacity: 0.12;
}

.agri-action-icon .eye {
  fill: currentColor;
  stroke: none;
}

/* Slight tint families for quick recognition */
.action-forest,
.action-riverbank,
.action-reed-bank {
  color: #2e7d32;
}

.action-clay-pit {
  color: #bf360c;
}

.action-quarry {
  color: #455a64;
}

.action-fishing,
.action-food {
  color: #0277bd;
}

.action-grain-seeds,
.action-sow-bake,
.action-cultivation {
  color: #f9a825;
}

.action-vegetable-seeds {
  color: #ef6c00;
}

.action-sheep {
  color: #616161;
}

.action-boar,
.action-cattle,
.action-animal-market,
.action-corral {
  color: #6d4c41;
}

.action-family,
.action-meeting,
.action-laborer,
.action-traveling {
  color: #6a1b9a;
}

.action-occupation {
  color: #1565c0;
}

.action-improvement,
.action-renovation,
.action-expansion,
.action-house,
.action-side-job {
  color: #4e342e;
}

.action-fencing,
.action-market,
.action-farm-supplies,
.action-building-supplies {
  color: #5d4037;
}

.action-plow {
  color: #558b2f;
}
</style>
