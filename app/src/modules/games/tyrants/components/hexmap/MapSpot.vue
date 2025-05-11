<template>
  <g :filter="filters">
    <circle
      :cx="spot.cx"
      :cy="spot.cy"
      r="10"
      class="site-troop-space" />

    <!-- <circle
         :cx="cx"
         :cy="cy"
         r="8"
         class="site-troop-space" /> -->
  </g>
</template>


<script>
export default {
  name: 'MapSpot',

  props: {
    spot: {
      type: Object,
      required: true
    },
    highlight: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    filters() {
      return this.highlight ? 'url(#selected)' : ''
    },
  },
}
</script>



<style scoped>
.site-troop-space {
  stroke: black;
  stroke-width: 1;
  fill: white;
}
</style>
