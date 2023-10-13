<template>
  <div class="hex-map">
    <svg class="game-map" width="1000" height="800" ref="gamemap">

      <Hex
        v-for="tile in tiles"
        :tile="tile"
      />

      <Connector
        v-for="c in hexConnections"
        :cx1="c.a.x"
        :cy1="c.a.y"
        :cx2="c.b.x"
        :cy2="c.b.y"
      />


    </svg>
  </div>
</template>


<script>
import { util } from 'battlestar-common'

import Connector from './Connector'
import Hex from './Hex'
import data from './data.js'
import tile from './tile.js'


export default {
  name: 'HexMap',

  components: {
    Connector,
    Hex,
  },

  data() {
    return {
      context: {
        layout: data.layouts.test,
        hexes: [],
        origin_cx: 300,
        origin_cy: 170,
        dx: 225,
        dy: 260,
      },
    }
  },

  computed: {
    hexConnections() {
      return []
      const output = []

      for (const tile of this.tiles) {
        for (const nei of tile.neighbors()) {
          const connections = this.generateConnection(tile, nei)
          for (const connection of connections) {
            output.push(connection)
          }
        }
      }

      // TODO: handle duplicates
      return output.filter(c => c !== undefined)
    },

    tiles() {
      const output = this.context.hexes.map(h => new tile.Tile(h, this.context))
      output.forEach(tile => this.positionTile(tile))
      return output
    },
  },

  methods: {
    calculateXpos(tile) {
      return this.context.origin_cx + tile.layout.x * this.context.dx
    },

    calculateYpos(tile) {
      return this.context.origin_cy + tile.layout.y * this.context.dy
    },

    generateConnections(a, b) {
      const output = []

      const aSide = a.sideTouching(b)
      const aSites = a.linksToSide(aSide)

      const bSide = b.sideTouching(a)
      const bSites = b.linksToSide(bSide)

      for (const aSite of aSites) {
        for (const bSite of bSites) {
          output.push({
            a: {
              x: aSite.x,
              y: aSite.y,
            },
            b: {
              x: bSite.x,
              y: ySite.y,
            },
          })
        }
      }

      return output
    },

    positionTile(tile) {
      tile.setCenterPoint(
        this.calculateXpos(tile),
        this.calculateYpos(tile),
      )
    },

    selectHexes() {
      const needed = util
        .array
        .collect(this.context.layout, x => x.id[0], x => x.id)

      const selected = Object
        .entries(needed)
        .flatMap(([letter, ids]) => {
          const elems = util.array.selectMany(data.hexes[letter], ids.length)
          return elems.map((hex, i) => ({
            layoutId: ids[i],
            pos: this.context.layout.find(x => x.id === ids[i]).pos,
            rotation: 0,
            ...hex,
          }))
        })

      return selected
    },
  },

  mounted() {
    this.context.hexes = this.selectHexes()
  },
}
</script>


<style scoped>
</style>
