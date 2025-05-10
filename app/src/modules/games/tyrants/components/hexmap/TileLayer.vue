<template>
  <polygon v-for="hex in hexes"
           :key="hex.name()"
           :points="points(hex)"
           class="hex-tile" />
</template>


<script>
export default {
  name: 'TileLayer',

  props: {
    tiles: Array,
  },

  computed: {
    hexes() {
      return this.tiles
    }
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

    points(hex) {
      return this.svgPointsFromArray(this.hexPointsWithRadius(hex.cx, hex.cy, 150))
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
