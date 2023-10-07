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
    rotation: Number,  // In the range [0, 5]
  },

  computed: {
    absolutelyPositionedSites() {
      const theta = this.rotation * ((2 * Math.PI) / 6)

      return this.sites.map(s => {
        const cosTheta = Math.cos(theta)
        const sinTheta = Math.sin(theta)

        const dx = s.dx * cosTheta - s.dy * sinTheta
        const dy = s.dy * cosTheta + s.dx * sinTheta

        return {
          ...s,
          x: this.cx + dx,
          y: this.cy + dy,
        }
      })
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
