<template>
  <g>
    <polygon class="hex-tile" :points="testHex" />

    <Connector v-for="connector in connectors" v-bind="connector" />
    <Site v-for="site in sitesOnly" v-bind="site" />
    <Spot v-for="spot in spotsOnly" v-bind="spot" />
  </g>
</template>


<script>
import Connector from './Connector'
import Site from './Site'
import Spot from './Spot'


export default {
  name: 'Hex',

  components: {
    Connector,
    Site,
    Spot,
  },

  props: {
    tile: Object,
  },

  computed: {
    connectors() {
      const output = []

      for (const loc of this.tile.sitesAbsolute()) {
        for (const name2 of loc.paths) {
          if (name2.startsWith('hex')) {
            continue
          }

          const loc2 = this.tile.sitesAbsolute().find(x => x.name === name2)
          output.push({
            cx1: loc.cx,
            cy1: loc.cy,
            cx2: loc2.cx,
            cy2: loc2.cy,
          })
        }
      }

      return output
    },

    sitesOnly() {
      return this.tile.sitesAbsolute().filter(x => x.kind !== 'troop-spot')
    },

    spotsOnly() {
      return this.tile.sitesAbsolute().filter(x => x.kind === 'troop-spot')
    },

    testHex() {
      return this.svgPointsFromArray(this.hexPointsWithRadius(this.tile.cx, this.tile.cy, 150))
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
