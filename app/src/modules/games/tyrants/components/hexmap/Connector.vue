<template>
  <g>
    <path :d="path"  class="connector-outer" />
    <path :d="path"  class="connector-inner" />
  </g>
</template>


<script>
export default {
  name: 'Connector',

  props: {
    cx1: Number,
    cy1: Number,
    cx2: Number,
    cy2: Number,
  },

  computed: {
    path() {
      const { cx1, cx2, cy1, cy2 } = this
      return `M ${cx1} ${cy1} L ${cx2} ${cy2}`
    }
  },
}
</script>


<style scoped>
.connector-outer {
  stroke: black;
  stroke-width: 6;
}

.connector-inner {
  stroke: white;
  stroke-width: 4;
}
</style>
