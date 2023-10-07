<template>
  <g>
    <polygon class="hex-tile" :points="testHex" />

    <Site v-for="site in absolutelyPositionedSites" v-bind="site" />
  </g>
</template>


<script>
import Site from './Site'


export default {
  name: 'Hex',

  components: {
    Site,
  },

  props: {
    cx: Number,
    cy: Number,
    sites: Array,
  },

  computed: {
    absolutelyPositionedSites() {
      return this.sites.map(s => ({
        ...s,
        x: this.cx + s.dx,
        y: this.cy + s.dy,
      }))
    },

    testHex() {
      return this.svgPointsFromArray(this.hexPointsWithRadius(this.cx, this.cy, 150))
    },
  },

  methods: {
    hexPointsWithRadius(x, y, radius) {
      const points = []

      for (var theta = 0; theta < Math.PI * 2; theta += Math.PI / 3) {
        const pointX = x + radius * Math.cos(theta)
        const pointY = y + radius * Math.sin(theta)

        points.push([pointX, pointY])
      }

      return points
    },

    svgPointsFromArray(points) {
      return points.map(p => p.join(',')).join(' ')
    },
  },

}
</script>


<style scoped>
.hex-tile {
  stroke: black;
  stroke-width: 2;
  fill: #eee;
}
</style>
