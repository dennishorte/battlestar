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
    cx: Number,
    cy: Number,
    sites: Array,
    rotation: Number,  // In the range [0, 5]
  },

  computed: {
    absolutelyPositioned() {
      const theta = this.rotation * ((2 * Math.PI) / 6)

      return this.sites.map(s => {
        const cosTheta = Math.cos(theta)
        const sinTheta = Math.sin(theta)

        const dx = s.dx * cosTheta - s.dy * sinTheta
        const dy = s.dy * cosTheta + s.dx * sinTheta

        return {
          ...s,
          cx: this.cx + dx,
          cy: this.cy + dy,
        }
      })
    },

    connectors() {
      const output = []

      for (const loc of this.absolutelyPositioned) {
        for (const name2 of loc.paths) {
          if (name2.startsWith('hex')) {
            continue
          }

          const loc2 = this.absolutelyPositioned.find(x => x.name === name2)
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
      return this.absolutelyPositioned.filter(x => x.kind !== 'troop-spot')
    },

    spotsOnly() {
      return this.absolutelyPositioned.filter(x => x.kind === 'troop-spot')
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
