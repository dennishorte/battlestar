<template>
  <svg class="curves" :height="height" :width="width">
    <CubicBezier
      v-for="curve in curves"
      :key="curve.id"
      :id="curve.id"
      :points="curve.points"
      can-select="true"
    />
  </svg>
</template>


<script>
import CubicBezier from './CubicBezier'

export default {
  name: 'CurveLayer',

  components: {
    CubicBezier,
  },

  props: {
    curves: Array,
    height: Number,
    width: Number,
  },
}
</script>


<style scoped>
.curves {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

svg {
  pointer-events: none;
}

svg * {
  pointer-events: auto;
}
</style>
