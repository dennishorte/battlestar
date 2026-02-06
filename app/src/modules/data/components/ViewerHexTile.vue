<template>
  <div class="viewer-hex-tile" :style="containerStyle">
    <svg class="hex-svg" :viewBox="svgViewBox" :style="svgStyle">
      <polygon
        :points="hexPoints"
        class="hex-polygon"
      />

      <!-- Path connectors between locations -->
      <line
        v-for="(path, index) in pathLines"
        :key="'path-' + index"
        :x1="path.x1"
        :y1="path.y1"
        :x2="path.x2"
        :y2="path.y2"
        class="path-connector"
      />

      <!-- Edge connection indicators -->
      <g v-for="(edge, index) in edgeIndicators" :key="'edge-' + index">
        <circle
          :cx="edge.x"
          :cy="edge.y"
          r="6"
          class="edge-indicator"
        />
        <text
          :x="edge.x"
          :y="edge.y"
          class="edge-label"
          text-anchor="middle"
          dominant-baseline="middle"
        >{{ edge.label }}</text>
      </g>

      <text
        class="hex-label"
        x="0"
        y="0"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ tile.id }}
      </text>
    </svg>

    <div class="locations-layer">
      <ViewerHexLocation
        v-for="loc in mockLocations"
        :key="loc.short"
        :loc="loc"
        :hexSize="hexSize"
      />
    </div>
  </div>
</template>


<script>
import ViewerHexLocation from './ViewerHexLocation.vue'

export default {
  name: 'ViewerHexTile',

  components: {
    ViewerHexLocation,
  },

  props: {
    tile: {
      type: Object,
      required: true,
    },
    hexSize: {
      type: Number,
      default: 100,
    },
  },

  computed: {
    hexWidth() {
      return this.hexSize * Math.sqrt(3)
    },

    hexHeight() {
      return this.hexSize * 2
    },

    containerStyle() {
      return {
        width: this.hexWidth + 'px',
        height: this.hexHeight + 'px',
        position: 'relative',
      }
    },

    svgStyle() {
      return {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }
    },

    svgViewBox() {
      return `${-this.hexWidth / 2} ${-this.hexHeight / 2} ${this.hexWidth} ${this.hexHeight}`
    },

    hexPoints() {
      const points = []
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2
        const x = this.hexSize * Math.cos(angle)
        const y = this.hexSize * Math.sin(angle)
        points.push(`${x},${y}`)
      }
      return points.join(' ')
    },

    mockLocations() {
      return this.tile.locations.map(loc => this.createMockLocation(loc))
    },

    pathLines() {
      if (!this.tile.paths) {
        return []
      }

      const locPositions = {}
      for (const loc of this.tile.locations) {
        const pos = loc.position || { x: 0.5, y: 0.5 }
        locPositions[loc.short] = {
          x: (pos.x - 0.5) * this.hexWidth,
          y: (pos.y - 0.5) * this.hexHeight,
        }
      }

      return this.tile.paths.map(path => {
        const from = locPositions[path[0]]
        const to = locPositions[path[1]]
        if (!from || !to) {
          return null
        }
        return {
          x1: from.x,
          y1: from.y,
          x2: to.x,
          y2: to.y,
        }
      }).filter(p => p !== null)
    },

    edgeIndicators() {
      if (!this.tile.edgeConnections) {
        return []
      }

      // Edge positions for pointy-top hex (at the edge midpoints)
      const edgePositions = {
        N: { x: 0, y: -this.hexSize * 0.92 },
        NE: { x: this.hexWidth * 0.42, y: -this.hexSize * 0.46 },
        SE: { x: this.hexWidth * 0.42, y: this.hexSize * 0.46 },
        S: { x: 0, y: this.hexSize * 0.92 },
        SW: { x: -this.hexWidth * 0.42, y: this.hexSize * 0.46 },
        NW: { x: -this.hexWidth * 0.42, y: -this.hexSize * 0.46 },
      }

      return this.tile.edgeConnections.map(conn => {
        const pos = edgePositions[conn.edge]
        if (!pos) {
          return null
        }
        return {
          x: pos.x,
          y: pos.y,
          label: conn.edge.charAt(0),
          edge: conn.edge,
        }
      }).filter(e => e !== null)
    },
  },

  methods: {
    createMockLocation(loc) {
      const isSite = loc.points > 0
      const isMajorSite = isSite && loc.control && loc.control.influence > 0

      return {
        short: loc.short,
        displayName: loc.name,
        size: loc.size,
        neutrals: loc.neutrals || 0,
        points: loc.points,
        start: loc.start,
        hexPosition: loc.position,
        control: loc.control || { influence: 0, points: 0 },
        totalControl: loc.totalControl || { influence: 0, points: 0 },

        name() {
          return loc.short
        },
        checkIsSite() {
          return isSite
        },
        checkIsMajorSite() {
          return isMajorSite
        },
        getTroops() {
          return []
        },
        getSpies() {
          return []
        },
        getEmptySpaces() {
          return loc.size - (loc.neutrals || 0)
        },
      }
    },
  },
}
</script>


<style scoped>
.viewer-hex-tile {
  pointer-events: none;
}

.hex-svg {
  pointer-events: none;
}

.hex-polygon {
  fill: #2a1a0a;
  stroke: #8b4513;
  stroke-width: 3;
  pointer-events: none;
}

.hex-label {
  fill: #666;
  font-size: 14px;
  font-weight: bold;
  pointer-events: none;
}

.path-connector {
  stroke: #8b6914;
  stroke-width: 4;
  stroke-linecap: round;
  pointer-events: none;
}

.edge-indicator {
  fill: #6b5344;
  stroke: #8b6914;
  stroke-width: 1;
}

.edge-label {
  fill: #ddd;
  font-size: 8px;
  font-weight: bold;
}

.locations-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}
</style>
