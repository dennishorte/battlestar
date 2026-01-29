<template>
  <MapConnector
    v-for="conn of connections"
    :key="conn.id"
    v-bind="conn"
    strokeColor="white"
    :borderWidth="1"
  />
</template>


<script>
import MapConnector from './MapConnector.vue'


export default {
  name: 'ConnectorLayer',

  components: {
    MapConnector,
  },

  props: {
    tiles: {
      type: Array,
      required: true
    },
  },

  computed: {
    connections() {
      const output = []

      for (const tile of this.tiles) {
        for (const c of this.connectionsOnTile(tile)) {
          output.push(c)
        }

        /* for (const c of this.connectionsOutOfTile(tile)) {
         *   output.push(c)
         * } */
      }

      return output
    },
  },

  methods: {
    connectionsOnTile(tile) {
      const sites = tile.sitesAbsolute()
      const output = []

      for (const connector of tile.connectors()) {
        const cSites = connector
          .map(name => sites.find(s => s.name === name))
          .filter(s => s !== undefined)

        if (cSites.length === 2) {
          output.push({
            id: `${tile.name()}:${connector[0]}:${connector[1]}`,
            points: {
              source: { x: cSites[0].cx, y: cSites[0].cy },
              target: { x: cSites[1].cx, y: cSites[1].cy },
              sourceHandle: { x: cSites[0].cx, y: cSites[0].cy },
              targetHandle: { x: cSites[1].cx, y: cSites[1].cy },
            },
          })
        }

        // At least one of the sites was an edge connector
        else {
          continue
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
