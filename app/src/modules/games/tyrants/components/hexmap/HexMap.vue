<template>
  <div class="hex-map">
    <svg class="game-map" width="1000" height="800" ref="gamemap">

      <Hex
        v-for="tile in game.tiles"
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
      return []
      console.log('hexConnections')

      const output = []

      for (const tile of this.game.tiles) {
        console.log(tile.neighbors().length)
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
  },

  methods: {
    calculateXpos(tile) {
      return this.game.ui.origin_cx + tile.layoutPos().x * this.game.ui.dx
    },

    calculateYpos(tile) {
      return this.game.ui.origin_cy + tile.layoutPos().y * this.game.ui.dy
    },

    generateConnections(a, b) {
      console.log('generateConnections')
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
            rotation: -1,
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

    console.log(this.game.tiles)
  },
}
</script>


<style scoped>
</style>
