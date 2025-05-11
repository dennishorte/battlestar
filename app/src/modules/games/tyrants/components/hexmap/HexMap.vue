<template>
  <div class="hex-map">
    <svg class="game-map"
         width="1000"
         height="800"
         ref="gamemap">

      <TileLayer :tiles="game.tiles" />
      <ConnectorLayer :tiles="game.tiles" />
      <SiteLayer :tiles="game.tiles" />

    </svg>
  </div>
</template>


<script>
import { util } from 'battlestar-common'

import ConnectorLayer from './ConnectorLayer'
import SiteLayer from './SiteLayer'
import TileLayer from './TileLayer'
import data from './data.js'
import tile from './tile.js'


export default {
  name: 'HexMap',

  components: {
    ConnectorLayer,
    SiteLayer,
    TileLayer,
  },

  data() {
    return {
      game: {
        getLayout: () => data.layouts.test,
        hexes: [],
        tiles: [],

        ui: {
          tiles: [],
          origin_cx: 300,
          origin_cy: 170,
          dx: 225,
          dy: 260,
        },
      },
    }
  },

  computed: {
    hexConnections() {
      const output = []

      for (const tile of this.game.tiles) {
        for (const nei of tile.neighbors()) {
          const connections = this.generateConnections(tile, nei)
          for (const connection of connections) {
            output.push(connection)
          }
        }
      }

      // TODO: handle duplicates
      return output.filter(c => c !== undefined)
    },
  },

  methods: {
    calculateXpos(tile) {
      return this.game.ui.origin_cx + tile.layoutPos().x * this.game.ui.dx
    },

    calculateYpos(tile) {
      return this.game.ui.origin_cy + tile.layoutPos().y * this.game.ui.dy
    },

    positionTile(tile) {
      tile.setCenterPoint(
        this.calculateXpos(tile),
        this.calculateYpos(tile),
      )
    },

    selectHexes() {
      const layout = this.game.getLayout()

      const needed = util
        .array
        .collect(layout, x => x.id[0], x => x.id)

      const selected = Object
        .entries(needed)
        .flatMap(([letter, ids]) => {
          const elems = util.array.selectMany(data.hexes[letter], ids.length)
          return elems.map((hex, i) => ({
            layoutId: ids[i],
            pos: layout.find(x => x.id === ids[i]).pos,
            rotation: -2,
            ...hex,
          }))
        })

      return selected
    },
  },

  mounted() {
    this.game.hexes = this.selectHexes()

    this.game.tiles = this.game.hexes.map(h => new tile.Tile(h, this.game))
    this.game.tiles.forEach(tile => this.positionTile(tile))
  },
}
</script>


<style scoped>
</style>
