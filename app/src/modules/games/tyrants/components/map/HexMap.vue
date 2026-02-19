<template>
  <div class="hex-map" :style="mapStyle">
    <div class="hex-container" :style="containerStyle">
      <HexTile
        v-for="hex in assembledHexes"
        :key="hex.tileId"
        :hex="hex"
        :hexSize="hexSize"
        :rotationMode="rotationMode"
        :rotationDelta="getRotationDelta(hex.tileId)"
      />

      <!-- Edge connectors layer (z-index places it above hex backgrounds, below locations) -->
      <svg class="edge-connectors-svg" :style="svgOverlayStyle">
        <!-- Cross-hex connectors (use preview during rotation mode) -->
        <line
          v-for="(conn, index) in activeCrossHexConnectors"
          :key="'cross-' + index"
          :x1="conn.x1"
          :y1="conn.y1"
          :x2="conn.x2"
          :y2="conn.y2"
          class="edge-connector"
          :class="{ preview: rotationMode }"
        />

        <!-- Edge tunnel connectors (preview during rotation mode) -->
        <line
          v-for="(conn, index) in activeEdgeTunnelConnectors"
          :key="'edge-tunnel-' + index"
          :x1="conn.x1"
          :y1="conn.y1"
          :x2="conn.x2"
          :y2="conn.y2"
          class="edge-connector off-map"
          :class="{ preview: rotationMode }"
        />

        <!-- Dead-end markers during rotation mode -->
        <circle
          v-for="(marker, index) in previewDeadEndMarkers"
          :key="'dead-end-' + index"
          :cx="marker.cx"
          :cy="marker.cy"
          r="6"
          class="dead-end-marker"
        />
      </svg>
    </div>
  </div>
</template>


<script>
import { tyrants } from 'battlestar-common'
import HexTile from './HexTile.vue'

const { hexTiles, mapConfigs } = tyrants.res
const { rotateHexPosition } = tyrants
const { getAdjacentPosition } = mapConfigs

const EDGE_OFFSETS = {
  'N': { x: 0, y: -0.25 },
  'NE': { x: 0.22, y: -0.12 },
  'SE': { x: 0.22, y: 0.12 },
  'S': { x: 0, y: 0.25 },
  'SW': { x: -0.22, y: 0.12 },
  'NW': { x: -0.22, y: -0.12 },
}

export default {
  name: 'HexMap',

  components: {
    HexTile,
  },

  inject: ['game', 'ui'],

  data() {
    return {
      hexSize: 150,  // Size of hex (center to vertex)
    }
  },

  computed: {
    rotationMode() {
      return this.ui.rotationMode
    },

    pendingRotations() {
      return this.ui.pendingRotations
    },

    assembledMap() {
      return this.game.state.assembledMap
    },

    // Calculate raw pixel positions first (before offset)
    rawHexPositions() {
      if (!this.assembledMap) {
        return []
      }
      return this.assembledMap.hexes.map(hex => {
        const pixel = this.axialToPixel(hex.position.q, hex.position.r)
        return { ...hex, pixelX: pixel.x, pixelY: pixel.y }
      })
    },

    // Flat-top hex dimensions
    hexWidth() {
      return this.hexSize * 2
    },

    hexHeight() {
      return this.hexSize * Math.sqrt(3)
    },

    // Calculate bounds from raw positions
    rawBounds() {
      if (this.rawHexPositions.length === 0) {
        return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
      }

      let minX = Infinity
      let maxX = -Infinity
      let minY = Infinity
      let maxY = -Infinity

      for (const hex of this.rawHexPositions) {
        minX = Math.min(minX, hex.pixelX - this.hexWidth / 2)
        maxX = Math.max(maxX, hex.pixelX + this.hexWidth / 2)
        minY = Math.min(minY, hex.pixelY - this.hexHeight / 2)
        maxY = Math.max(maxY, hex.pixelY + this.hexHeight / 2)
      }

      return { minX, maxX, minY, maxY }
    },

    // Offset to apply to all positions (moves content to start at padding,padding)
    positionOffset() {
      const padding = 40
      return {
        x: -this.rawBounds.minX + padding,
        y: -this.rawBounds.minY + padding,
      }
    },

    assembledHexes() {
      if (!this.assembledMap) {
        return []
      }

      return this.rawHexPositions.map(hex => ({
        ...hex,
        pixelX: hex.pixelX + this.positionOffset.x,
        pixelY: hex.pixelY + this.positionOffset.y,
        locations: this.getLocationsForHex(hex.tileId),
      }))
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

      for (const hex of this.assembledHexes) {
        for (const loc of hex.locations) {
          const pos = loc.hexPosition || { x: 0.5, y: 0.5 }
          positions[loc.name()] = {
            x: hex.pixelX + (pos.x - 0.5) * this.hexWidth,
            y: hex.pixelY + (pos.y - 0.5) * this.hexHeight,
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

    // Preview connectors during rotation mode — computed from tile data + pending rotations
    previewCrossHexConnectors() {
      if (!this.rotationMode || !this.assembledMap) {
        return []
      }

      const connectors = []
      const hexes = this.assembledHexes
      const seen = new Set()

      for (let i = 0; i < hexes.length; i++) {
        const hex1 = hexes[i]
        const tile1 = hexTiles.allTiles[hex1.tileId]
        const rot1 = this.pendingRotations[hex1.tileId] ?? hex1.rotation

        for (let j = i + 1; j < hexes.length; j++) {
          const hex2 = hexes[j]
          const tile2 = hexTiles.allTiles[hex2.tileId]
          const rot2 = this.pendingRotations[hex2.tileId] ?? hex2.rotation

          // Check if adjacent
          const edgeDir = mapConfigs.getEdgeDirection(hex1.position, hex2.position)
          if (!edgeDir) {
            continue
          }

          const oppositeEdge = hexTiles.getOppositeEdge(edgeDir)
          const conns1 = hexTiles.getRotatedEdgeConnections(tile1, rot1)
          const conns2 = hexTiles.getRotatedEdgeConnections(tile2, rot2)
          const conn1 = conns1.find(c => c.edge === edgeDir)
          const conn2 = conns2.find(c => c.edge === oppositeEdge)

          if (conn1 && conn2) {
            // Compute positions using pending rotations
            const loc1Orig = tile1.locations.find(l => l.short === conn1.location)
            const loc2Orig = tile2.locations.find(l => l.short === conn2.location)
            if (!loc1Orig || !loc2Orig) {
              continue
            }

            const pos1 = rotateHexPosition(loc1Orig.position, rot1)
            const pos2 = rotateHexPosition(loc2Orig.position, rot2)

            const key = [hex1.tileId + '.' + conn1.location, hex2.tileId + '.' + conn2.location].sort().join('|')
            if (seen.has(key)) {
              continue
            }
            seen.add(key)

            connectors.push({
              x1: hex1.pixelX + (pos1.x - 0.5) * this.hexWidth,
              y1: hex1.pixelY + (pos1.y - 0.5) * this.hexHeight,
              x2: hex2.pixelX + (pos2.x - 0.5) * this.hexWidth,
              y2: hex2.pixelY + (pos2.y - 0.5) * this.hexHeight,
            })
          }
        }
      }

      return connectors
    },

    // Use preview connectors during rotation mode, normal connectors otherwise
    activeCrossHexConnectors() {
      return this.rotationMode ? this.previewCrossHexConnectors : this.crossHexConnectors
    },

    // Edge tunnel connectors: lines from source locations to edge tunnel locations
    edgeTunnelConnectors() {
      const connectors = []

      for (const hex of this.assembledHexes) {
        // Find edge tunnel locations on this hex
        for (const loc of hex.locations) {
          if (loc.short && loc.short.startsWith('edge-')) {
            // This is an edge tunnel - find its source location (its only neighbor)
            const neighborName = loc.neighborNames?.[0]
            if (!neighborName) {
              continue
            }

            const fromPos = this.locationPixelPositions[neighborName]
            const toPos = this.locationPixelPositions[loc.name()]

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
      }

      return connectors
    },

    // Preview edge tunnel connectors during rotation mode
    previewEdgeTunnelConnectors() {
      if (!this.rotationMode || !this.assembledMap) {
        return { connectors: [], deadEnds: [] }
      }

      const connectors = []
      const deadEnds = []

      for (const hex of this.assembledHexes) {
        const tile = hexTiles.allTiles[hex.tileId]
        const rot = this.pendingRotations[hex.tileId] ?? hex.rotation
        const edgeConns = hexTiles.getRotatedEdgeConnections(tile, rot)

        for (const conn of edgeConns) {
          // Check if adjacent hex exists
          const adjPos = getAdjacentPosition(hex.position.q, hex.position.r, conn.edge)
          const adjKey = `${adjPos.q},${adjPos.r}`
          const adjHex = this.hexByPosition[adjKey]

          let isDeadEnd = true
          if (adjHex) {
            const adjTile = hexTiles.allTiles[adjHex.tileId]
            const adjRot = this.pendingRotations[adjHex.tileId] ?? adjHex.rotation
            const adjEdgeConns = hexTiles.getRotatedEdgeConnections(adjTile, adjRot)
            const oppositeEdge = hexTiles.getOppositeEdge(conn.edge)
            if (adjEdgeConns.find(c => c.edge === oppositeEdge)) {
              isDeadEnd = false
            }
          }

          // Compute source location pixel position
          const locOrig = tile.locations.find(l => l.short === conn.location)
          if (!locOrig) {
            continue
          }

          const pos = rotateHexPosition(locOrig.position, rot)
          const srcX = hex.pixelX + (pos.x - 0.5) * this.hexWidth
          const srcY = hex.pixelY + (pos.y - 0.5) * this.hexHeight

          // Compute dead-end endpoint
          const offset = EDGE_OFFSETS[conn.edge]
          const endX = srcX + offset.x * this.hexWidth
          const endY = srcY + offset.y * this.hexHeight

          if (isDeadEnd) {
            connectors.push({ x1: srcX, y1: srcY, x2: endX, y2: endY })
            deadEnds.push({ cx: endX, cy: endY })
          }
        }
      }

      return { connectors, deadEnds }
    },

    activeEdgeTunnelConnectors() {
      return this.rotationMode
        ? this.previewEdgeTunnelConnectors.connectors
        : this.edgeTunnelConnectors
    },

    previewDeadEndMarkers() {
      return this.rotationMode
        ? this.previewEdgeTunnelConnectors.deadEnds
        : []
    },

    mapDimensions() {
      const padding = 40
      const width = this.rawBounds.maxX - this.rawBounds.minX + padding * 2
      const height = this.rawBounds.maxY - this.rawBounds.minY + padding * 2
      return { width, height }
    },

    containerStyle() {
      return {
        width: this.mapDimensions.width + 'px',
        height: this.mapDimensions.height + 'px',
        position: 'relative',
      }
    },

    mapStyle() {
      return {
        width: this.mapDimensions.width + 'px',
        height: this.mapDimensions.height + 'px',
        minWidth: this.mapDimensions.width + 'px',
        minHeight: this.mapDimensions.height + 'px',
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
    // Convert axial coordinates to pixel coordinates (flat-top orientation)
    axialToPixel(q, r) {
      const x = this.hexSize * (3 / 2 * q)
      const y = this.hexSize * (Math.sqrt(3) / 2 * q + Math.sqrt(3) * r)
      return { x, y }
    },

    getLocationsForHex(tileId) {
      return this.game.getLocationAll().filter(loc => loc.hexId === tileId)
    },

    getRotationDelta(tileId) {
      if (!this.rotationMode) {
        return 0
      }
      const currentRotation = this.assembledMap?.hexes?.find(h => h.tileId === tileId)?.rotation ?? 0
      const pendingRotation = this.pendingRotations[tileId] ?? currentRotation
      return pendingRotation - currentRotation
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

.edge-connector.preview {
  stroke: #4caf50;
  stroke-width: 5;
}

.edge-connector.off-map {
  stroke: #6b5910;
  stroke-width: 3;
}

.edge-connector.off-map.preview {
  stroke: #4caf50;
  stroke-width: 4;
}

.dead-end-marker {
  fill: #ff5252;
  stroke: #b71c1c;
  stroke-width: 2;
  opacity: 0.9;
}
</style>
