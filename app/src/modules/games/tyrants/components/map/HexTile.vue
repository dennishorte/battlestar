<template>
  <div class="hex-tile" :style="tileStyle">
    <svg class="hex-svg" :viewBox="svgViewBox" :style="svgStyle">
      <polygon
        :points="hexPoints"
        class="hex-polygon"
        :class="{ rotated: hex.rotation > 0 }"
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

      <text
        class="hex-label"
        :x="labelX"
        :y="labelY"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ hex.tileId }}
      </text>
    </svg>

    <div class="locations-layer">
      <HexLocation
        v-for="loc in hex.locations"
        :key="loc.id"
        :loc="loc"
        :hexSize="hexSize"
      />
    </div>
  </div>
</template>


<script>
import HexLocation from './HexLocation.vue'

export default {
  name: 'HexTile',

  components: {
    HexLocation,
  },

  props: {
    hex: {
      type: Object,
      required: true,
    },
    hexSize: {
      type: Number,
      required: true,
    },
  },

  computed: {
    // Flat-top hex: width = 2 * size, height = sqrt(3) * size
    hexWidth() {
      return this.hexSize * 2
    },

    hexHeight() {
      return this.hexSize * Math.sqrt(3)
    },

    tileStyle() {
      return {
        position: 'absolute',
        left: (this.hex.pixelX - this.hexWidth / 2) + 'px',
        top: (this.hex.pixelY - this.hexHeight / 2) + 'px',
        width: this.hexWidth + 'px',
        height: this.hexHeight + 'px',
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
      const pos = this.hex.labelPosition || { x: 0.5, y: 0.5 }
      return (pos.x - 0.5) * this.hexWidth
    },

    labelY() {
      const pos = this.hex.labelPosition || { x: 0.5, y: 0.5 }
      return (pos.y - 0.5) * this.hexHeight
    },

    pathLines() {
      if (!this.hex.paths) {
        return []
      }

      // Build a lookup of location positions by short name
      // Paths use short names (e.g., 'great-web'), locations have full names (e.g., 'A1.great-web')
      const locPositions = {}
      for (const loc of this.hex.locations) {
        const pos = loc.hexPosition || { x: 0.5, y: 0.5 }
        // Convert from 0-1 range to SVG coordinates (centered at 0,0)
        const coords = {
          x: (pos.x - 0.5) * this.hexWidth,
          y: (pos.y - 0.5) * this.hexHeight,
        }
        // Index by short name (the part after the dot in the full name)
        locPositions[loc.short] = coords
      }

      return this.hex.paths.map(path => {
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
  },
}
</script>


<style scoped>
.hex-tile {
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

.locations-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}
</style>
