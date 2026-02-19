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

      <!-- Edge connection lines from location to edge -->
      <line
        v-for="(edge, index) in edgeConnectorLines"
        :key="'edge-conn-' + index"
        :x1="edge.x1"
        :y1="edge.y1"
        :x2="edge.x2"
        :y2="edge.y2"
        class="edge-connector-line"
      />

      <!-- Edge connection indicators -->
      <g v-for="(edge, index) in edgeIndicators" :key="'edge-' + index">
        <rect
          :x="edge.x - 10"
          :y="edge.y - 6"
          width="20"
          height="12"
          rx="3"
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
        :x="labelX"
        :y="labelY"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ tile.id }}
      </text>

      <!-- Special rules indicator -->
      <g
        v-if="tile.specialRules"
        class="special-rules-indicator"
        @click="toggleRulesPopup"
      >
        <circle
          :cx="rulesIndicatorX"
          :cy="rulesIndicatorY"
          r="8"
          class="rules-circle"
        />
        <text
          :x="rulesIndicatorX"
          :y="rulesIndicatorY"
          text-anchor="middle"
          dominant-baseline="middle"
          class="rules-icon"
        >?</text>
        <title>{{ specialRulesText }}</title>
      </g>
    </svg>

    <!-- Special rules popup -->
    <div
      v-if="showRulesPopup && tile.specialRules"
      class="rules-popup"
      :style="rulesPopupStyle"
      @click.stop
    >
      <div class="rules-popup-header">
        <span>Special Rules</span>
        <button class="rules-popup-close" @click="showRulesPopup = false">&times;</button>
      </div>
      <div class="rules-popup-content">
        <pre>{{ specialRulesText }}</pre>
      </div>
    </div>

    <div class="locations-layer" :style="locationsLayerStyle">
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

  data() {
    return {
      showRulesPopup: false,
    }
  },

  computed: {
    // Flat-top hex: width = 2 * size, height = sqrt(3) * size
    hexWidth() {
      return this.hexSize * 2
    },

    hexHeight() {
      return this.hexSize * Math.sqrt(3)
    },

    // Padding for edge indicators that extend beyond hex boundary
    edgePadding() {
      return 12
    },

    containerStyle() {
      return {
        width: (this.hexWidth + this.edgePadding * 2) + 'px',
        height: (this.hexHeight + this.edgePadding * 2) + 'px',
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
      const padW = this.hexWidth + this.edgePadding * 2
      const padH = this.hexHeight + this.edgePadding * 2
      return `${-padW / 2} ${-padH / 2} ${padW} ${padH}`
    },

    hexPoints() {
      // Flat-top hex vertices (start from right, go counterclockwise)
      const points = []
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        const x = this.hexSize * Math.cos(angle)
        const y = this.hexSize * Math.sin(angle)
        points.push(`${x},${y}`)
      }
      return points.join(' ')
    },

    labelX() {
      const pos = this.tile.labelPosition || { x: 0.5, y: 0.5 }
      return (pos.x - 0.5) * this.hexWidth
    },

    labelY() {
      const pos = this.tile.labelPosition || { x: 0.5, y: 0.5 }
      return (pos.y - 0.5) * this.hexHeight
    },

    rulesIndicatorX() {
      const pos = this.tile.rulesPosition || { x: 0.5, y: 0.65 }
      return (pos.x - 0.5) * this.hexWidth
    },

    rulesIndicatorY() {
      const pos = this.tile.rulesPosition || { x: 0.5, y: 0.65 }
      return (pos.y - 0.5) * this.hexHeight
    },

    specialRulesText() {
      if (!this.tile.specialRules) {
        return ''
      }
      const rules = this.tile.specialRules
      if (rules.type === 'triad') {
        const lines = ['Triad Scoring:']
        if (rules.bonuses.presence) {
          const b = rules.bonuses.presence
          lines.push(`Presence: +${b.influence || 0} Influence`)
        }
        if (rules.bonuses.control) {
          const b = rules.bonuses.control
          const parts = []
          if (b.influence) {
            parts.push(`+${b.influence} Inf`)
          }
          if (b.power) {
            parts.push(`+${b.power} Pow`)
          }
          if (b.vp) {
            parts.push(`+${b.vp} VP`)
          }
          lines.push(`Control: ${parts.join(', ')}`)
        }
        if (rules.bonuses.totalControl) {
          const b = rules.bonuses.totalControl
          const parts = []
          if (b.influence) {
            parts.push(`+${b.influence} Inf`)
          }
          if (b.power) {
            parts.push(`+${b.power} Pow`)
          }
          if (b.vp) {
            parts.push(`+${b.vp} VP`)
          }
          lines.push(`Total Control: ${parts.join(', ')}`)
        }
        return lines.join('\n')
      }
      return JSON.stringify(rules)
    },

    rulesPopupStyle() {
      const pos = this.tile.rulesPosition || { x: 0.5, y: 0.65 }
      const left = this.edgePadding + (pos.x * this.hexWidth)
      const top = this.edgePadding + (pos.y * this.hexHeight) + 15
      return {
        position: 'absolute',
        left: left + 'px',
        top: top + 'px',
        transform: 'translateX(-50%)',
      }
    },

    locationsLayerStyle() {
      return {
        position: 'absolute',
        top: this.edgePadding + 'px',
        left: this.edgePadding + 'px',
        width: this.hexWidth + 'px',
        height: this.hexHeight + 'px',
      }
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

    // Edge midpoint positions for flat-top hex
    edgePositions() {
      const h = this.hexHeight / 2
      const w = this.hexWidth / 2
      return {
        N: { x: 0, y: -h },
        NE: { x: w * 0.75, y: -h * 0.5 },
        SE: { x: w * 0.75, y: h * 0.5 },
        S: { x: 0, y: h },
        SW: { x: -w * 0.75, y: h * 0.5 },
        NW: { x: -w * 0.75, y: -h * 0.5 },
      }
    },

    edgeIndicators() {
      if (!this.tile.edgeConnections) {
        return []
      }

      return this.tile.edgeConnections.map(conn => {
        const pos = this.edgePositions[conn.edge]
        if (!pos) {
          return null
        }
        return {
          x: pos.x,
          y: pos.y,
          label: conn.edge,
          edge: conn.edge,
        }
      }).filter(e => e !== null)
    },

    // Lines connecting locations to their edge indicators
    edgeConnectorLines() {
      if (!this.tile.edgeConnections) {
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

      return this.tile.edgeConnections.map(conn => {
        const locPos = locPositions[conn.location]
        const edgePos = this.edgePositions[conn.edge]
        if (!locPos || !edgePos) {
          return null
        }
        return {
          x1: locPos.x,
          y1: locPos.y,
          x2: edgePos.x,
          y2: edgePos.y,
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

    toggleRulesPopup() {
      this.showRulesPopup = !this.showRulesPopup
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

.edge-connector-line {
  stroke: #5a4a3a;
  stroke-width: 2;
  stroke-dasharray: 4 2;
  pointer-events: none;
}

.edge-indicator {
  fill: #4a3a2a;
  stroke: #6b5344;
  stroke-width: 1;
}

.edge-label {
  fill: #aaa;
  font-size: 7px;
  font-weight: bold;
}

.locations-layer {
  z-index: 10;
}

.rules-circle {
  fill: #6a4a2a;
  stroke: #8b6914;
  stroke-width: 1.5;
}

.rules-icon {
  fill: #d4a574;
  font-size: 10px;
  font-weight: bold;
}

.special-rules-indicator {
  pointer-events: auto;
  cursor: pointer;
}

.rules-popup {
  background: #2a2a2a;
  border: 1px solid #8b6914;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  z-index: 100;
  min-width: 150px;
  pointer-events: auto;
}

.rules-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4em 0.6em;
  background: #3a3a3a;
  border-bottom: 1px solid #444;
  border-radius: 6px 6px 0 0;
  font-size: 0.8em;
  font-weight: bold;
  color: #d4a574;
}

.rules-popup-close {
  background: none;
  border: none;
  color: #888;
  font-size: 1.2em;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.rules-popup-close:hover {
  color: #fff;
}

.rules-popup-content {
  padding: 0.6em;
}

.rules-popup-content pre {
  margin: 0;
  font-family: inherit;
  font-size: 0.75em;
  color: #ccc;
  white-space: pre-wrap;
}
</style>
