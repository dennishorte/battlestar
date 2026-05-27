<template>
  <svg class="resource-icon"
       :class="`resource-${type}`"
       viewBox="0 0 16 16"
       :title="type">
    <circle v-if="type === 'solari'"
            cx="8"
            cy="8"
            r="6" />
    <polygon v-else-if="type === 'spice'"
             points="8,1.5 14,5 14,11 8,14.5 2,11 2,5" />
    <path v-else-if="type === 'water'"
          d="M8 1.5 C 8 1.5, 2.8 7, 2.8 11 A 5.2 5.2 0 0 0 13.2 11 C 13.2 7, 8 1.5, 8 1.5 Z" />
  </svg>
</template>


<script>
export default {
  name: 'DuneResourceIcon',

  props: {
    type: { type: String, required: true },
  },
}
</script>


<style scoped>
.resource-icon {
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  display: inline-block;
  vertical-align: -.15em;
}

.resource-solari {
  fill: #b8b8b8;
  stroke: #6a6a6a;
  stroke-width: 1;
}

.resource-spice {
  fill: #e08828;
  stroke: #a05a0a;
  stroke-width: 1;
  stroke-linejoin: round;
}

.resource-water {
  fill: #4a9fd8;
  stroke: #1a5f9a;
  stroke-width: 1;
  stroke-linejoin: round;
}
</style>
