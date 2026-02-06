<template>
  <div class="hex-map" :style="mapStyle">
    <div class="hex-container" :style="containerStyle">
      <HexTile
        v-for="hex in assembledHexes"
        :key="hex.tileId"
        :hex="hex"
        :hexSize="hexSize"
      />

      <!-- Edge connectors layer (z-index places it above hex backgrounds, below locations) -->
      <svg class="edge-connectors-svg" :style="svgOverlayStyle">
        <!-- Cross-hex connectors -->
        <line
          v-for="(conn, index) in crossHexConnectors"
          :key="'cross-' + index"
          :x1="conn.x1"
          :y1="conn.y1"
          :x2="conn.x2"
          :y2="conn.y2"
          class="edge-connector"
        />

        <!-- Off-map connectors -->
        <line
          v-for="(conn, index) in offMapConnectors"
          :key="'offmap-' + index"
          :x1="conn.x1"
          :y1="conn.y1"
          :x2="conn.x2"
          :y2="conn.y2"
          class="edge-connector off-map"
        />
      </svg>
    </div>
  </div>
</template>


<script>
import HexTile from './HexTile.vue'

export default {
  name: 'HexMap',

  components: {
    HexTile,
  },

  inject: ['game'],

  data() {
    return {
      hexSize: 120,  // Size of hex (center to vertex)
    }
  },

  computed: {
    assembledMap() {
      return this.game.state.assembledMap
    },

    assembledHexes() {
      if (!this.assembledMap) {
        return []
      }

      return this.assembledMap.hexes.map(hex => {
        const pixel = this.axialToPixel(hex.position.q, hex.position.r)
        return {
          ...hex,
          pixelX: pixel.x,
          pixelY: pixel.y,
          locations: this.getLocationsForHex(hex.tileId),
        }
      })
    },

    // Build a map of hex positions to hex data for quick lookup
    hexByPosition() {
      const map = {}
      for (const hex of this.assembledHexes) {
        const key = `${hex.position.q},${hex.position.r}`
        map[key] = hex
      }
      return map
    },

    // Build a map of location names to their pixel positions
    locationPixelPositions() {
      const positions = {}
      const hexWidth = this.hexSize * Math.sqrt(3)
      const hexHeight = this.hexSize * 2

      for (const hex of this.assembledHexes) {
        for (const loc of hex.locations) {
          const pos = loc.hexPosition || { x: 0.5, y: 0.5 }
          positions[loc.name()] = {
            x: hex.pixelX + (pos.x - 0.5) * hexWidth,
            y: hex.pixelY + (pos.y - 0.5) * hexHeight,
          }
        }
      }
      return positions
    },

    // Get edge connections for each hex (cross-hex neighbor relationships)
    hexEdgeConnections() {
      const result = {}

      for (const hex of this.assembledHexes) {
        // Find the tile's edge connections from the locations
        const edgeConns = []
        for (const loc of hex.locations) {
          // Check if this location's neighbors include locations on other hexes
          if (loc.neighborNames) {
            for (const neighborName of loc.neighborNames) {
              // If neighbor is on a different hex, this is an edge connection
              const neighborHexId = neighborName.split('.')[0]
              if (neighborHexId !== hex.tileId) {
                edgeConns.push({
                  location: loc,
                  neighborName: neighborName,
                })
              }
            }
          }
        }
        result[hex.tileId] = edgeConns
      }
      return result
    },

    // Cross-hex connectors: lines between locations on adjacent hexes
    crossHexConnectors() {
      const connectors = []
      const seen = new Set()

      for (const hex of this.assembledHexes) {
        const edgeConns = this.hexEdgeConnections[hex.tileId] || []

        for (const conn of edgeConns) {
          const locName = conn.location.name()
          const neighborName = conn.neighborName

          // Create a unique key to avoid drawing the same connector twice
          const key = [locName, neighborName].sort().join('|')
          if (seen.has(key)) {
            continue
          }
          seen.add(key)

          const fromPos = this.locationPixelPositions[locName]
          const toPos = this.locationPixelPositions[neighborName]

          if (fromPos && toPos) {
            connectors.push({
              x1: fromPos.x,
              y1: fromPos.y,
              x2: toPos.x,
              y2: toPos.y,
            })
          }
        }
      }

      return connectors
    },

    // Off-map connectors: lines going off the edge for edge locations on map boundaries
    offMapConnectors() {
      const connectors = []
      const EDGE_DIRECTIONS = {
        'N': { x: 0, y: -1 },
        'NE': { x: 0.866, y: -0.5 },
        'SE': { x: 0.866, y: 0.5 },
        'S': { x: 0, y: 1 },
        'SW': { x: -0.866, y: 0.5 },
        'NW': { x: -0.866, y: -0.5 },
      }
      const ADJACENT_DELTAS = {
        'N': { dq: 0, dr: -1 },
        'NE': { dq: 1, dr: -1 },
        'SE': { dq: 1, dr: 0 },
        'S': { dq: 0, dr: 1 },
        'SW': { dq: -1, dr: 1 },
        'NW': { dq: -1, dr: 0 },
      }

      for (const hex of this.assembledHexes) {
        // Use the edgeConnections data from the tile
        const edgeConns = hex.edgeConnections || []

        for (const conn of edgeConns) {
          const edge = conn.edge
          const locationShort = conn.location

          // Check if there's an adjacent hex at this edge
          const delta = ADJACENT_DELTAS[edge]
          const adjKey = `${hex.position.q + delta.dq},${hex.position.r + delta.dr}`
          const adjacentHex = this.hexByPosition[adjKey]

          if (!adjacentHex) {
            // No adjacent hex - this is an off-map edge
            // Find the full location name
            const fullLocName = `${hex.tileId}.${locationShort}`
            const locPos = this.locationPixelPositions[fullLocName]

            if (locPos) {
              const dir = EDGE_DIRECTIONS[edge]
              const offMapDist = 30  // How far off the edge to draw
              connectors.push({
                x1: locPos.x,
                y1: locPos.y,
                x2: locPos.x + dir.x * offMapDist,
                y2: locPos.y + dir.y * offMapDist,
              })
            }
          }
        }
      }

      return connectors
    },

    bounds() {
      if (this.assembledHexes.length === 0) {
        return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
      }

      const hexWidth = this.hexSize * Math.sqrt(3)
      const hexHeight = this.hexSize * 2

      let minX = Infinity
      let maxX = -Infinity
      let minY = Infinity
      let maxY = -Infinity

      for (const hex of this.assembledHexes) {
        minX = Math.min(minX, hex.pixelX - hexWidth / 2)
        maxX = Math.max(maxX, hex.pixelX + hexWidth / 2)
        minY = Math.min(minY, hex.pixelY - hexHeight / 2)
        maxY = Math.max(maxY, hex.pixelY + hexHeight / 2)
      }

      return { minX, maxX, minY, maxY }
    },

    containerStyle() {
      const padding = 40
      const width = this.bounds.maxX - this.bounds.minX + padding * 2
      const height = this.bounds.maxY - this.bounds.minY + padding * 2

      return {
        width: width + 'px',
        height: height + 'px',
        position: 'relative',
        transform: `translate(${-this.bounds.minX + padding}px, ${-this.bounds.minY + padding}px)`,
      }
    },

    mapStyle() {
      const padding = 40
      const width = this.bounds.maxX - this.bounds.minX + padding * 2
      const height = this.bounds.maxY - this.bounds.minY + padding * 2

      return {
        width: width + 'px',
        height: height + 'px',
        minWidth: width + 'px',
        minHeight: height + 'px',
        overflow: 'visible',
      }
    },

    svgOverlayStyle() {
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }
    },
  },

  methods: {
    // Convert axial coordinates to pixel coordinates (pointy-top orientation)
    axialToPixel(q, r) {
      const x = this.hexSize * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r)
      const y = this.hexSize * (3 / 2 * r)
      return { x, y }
    },

    getLocationsForHex(tileId) {
      return this.game.getLocationAll().filter(loc => loc.hexId === tileId)
    },
  },
}
</script>


<style scoped>
.hex-map {
  position: relative;
  overflow: visible;
}

.hex-container {
  position: relative;
}

.edge-connectors-svg {
  z-index: 5;
}

.edge-connector {
  stroke: #8b6914;
  stroke-width: 4;
  stroke-linecap: round;
}

.edge-connector.off-map {
  stroke: #6b5910;
  stroke-width: 3;
}
</style>
