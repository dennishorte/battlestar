<template>
  <div class="hex-map">
    <svg class="game-map" width="1000" height="800" ref="gamemap">
      <circle cx="150" cy="150" r="50" stroke="black" stroke-width="2" fill="lightblue" />

      <polygon
        :points="testHex"
        stroke="black"
        fill="yellow"
        stroke-width="2" />

      <Site name="Chaulsin" :x="270" :y="380" :size="4" />
      <Site name="Caves" :x="360" :y="310" :size="6" />
      <Site name="Halls of the|Scoured Legion" :x="265" :y="230" :size="3" />
      <Site name="Chasmleap|Bridge" :x="250" :y="300" :size="5" />

    </svg>
  </div>
</template>


<script>
import Site from './Site'


export default {
  name: 'HexMap',

  components: {
    Site,
  },

  computed: {
    testHex() {
      return this.svgPointsFromArray(this.hexPointsWithRadius(300, 300, 150))
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
</style>
