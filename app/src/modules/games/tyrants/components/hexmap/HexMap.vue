<template>
  <div class="hex-map">
    <svg class="game-map" width="1000" height="800" ref="gamemap">

      <!-- <Hex :cx="300" :cy="300" :sites="a2sites" :rotation="0" />
           <Hex :cx="525" :cy="430" :sites="b2sites" :rotation="0" />
           <Hex :cx="525" :cy="170" :sites="c1sites" :rotation="0" />
      -->

      <Hex
        v-for="tile in tiles"
        :cx="calculateXpos(tile)"
        :cy="calculateYpos(tile)"
        :sites="tile.data.sites"
        :rotation="0"
      />


    </svg>
  </div>
</template>


<script>
import { util } from 'battlestar-common'

import Hex from './Hex'
import data from './data.js'
import tile from './tile.js'


export default {
  name: 'HexMap',

  components: {
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
      const output = []

      for (const hex of this.hexes) {
        for (const nei of this.neighbors(hex)) {
          output.push(this.hexConnection(hex, nei, 1))
        }
      }

      return output
    },

    tiles() {
      return this.context.hexes.map(h => new tile.Tile(h, this.context))
    },
  },

  methods: {
    calculateXpos(tile) {
      return this.context.origin_cx + tile.layout.x * this.context.dx
    },

    calculateYpos(tile) {
      return this.context.origin_cy + tile.layout.y * this.context.dy
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
