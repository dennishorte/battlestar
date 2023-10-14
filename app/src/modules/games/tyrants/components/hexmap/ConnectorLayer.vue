<template>
  <Connector v-for="conn of connections" v-bind="conn" />
</template>


<script>
import Connector from './Connector'


export default {
  name: 'ConnectorLayer',

  components: {
    Connector,
  },

  props: {
    tiles: Array,
  },

  computed: {
    connections() {
      const output = []

      for (const tile of this.tiles) {
        for (const c of this.connectionsOnTile(tile)) {
          output.push(c)
        }

        for (const c of this.connectionsOutOfTile(tile)) {
          output.push(c)
        }
      }

      return output
    }
  },

  methods: {
    connectionsOnTile(tile) {
      const output = []

      for (const loc of tile.sitesAbsolute()) {
        for (const name2 of loc.paths) {
          if (name2.startsWith('hex')) {
            continue
          }

          const loc2 = tile.sitesAbsolute().find(x => x.name === name2)
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

    connectionsOutOfTile(tile) {
      const output = []

      for (const nei of tile.neighbors()) {
        const connections = this.generateConnections(tile, nei)
        for (const connection of connections) {
          output.push(connection)
        }
      }

      return output
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
            cx1: aSite.cx,
            cy1: aSite.cy,
            cx2: bSite.cx,
            cy2: bSite.cy,
          })
        }
      }

      return output
    },

  },
}
</script>
