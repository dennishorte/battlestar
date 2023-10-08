<template>
  <g>
    <circle
      :cx="cx"
      :cy="cy"
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
  name: 'Spot',

  props: {
    cx: Number,
    cy: Number,
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
