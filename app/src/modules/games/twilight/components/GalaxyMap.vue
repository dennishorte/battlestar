<template>
  <div class="galaxy-map" ref="wrapper">
    <div class="galaxy-viewport" :style="viewportStyle">
      <!-- Hyperlane connection lines -->
      <svg v-if="hyperlaneLines.length > 0" class="hyperlane-overlay">
        <line
          v-for="(line, i) in hyperlaneLines"
          :key="i"
          :x1="line.x1"
          :y1="line.y1"
          :x2="line.x2"
          :y2="line.y2"
          class="hyperlane-connection"
        />
      </svg>

      <SystemTile
        v-for="(system, systemId) in systems"
        :key="systemId"
        :systemId="systemId"
        :system="system"
        :hexSize="hexSize"
        :highlighted="isHighlighted(systemId)"
        :interactive="isInteractive(systemId)"
        @click="handleSystemClick"
      />
    </div>
  </div>
</template>

<script>
import SystemTile from './SystemTile.vue'

const SQRT3 = Math.sqrt(3)

export default {
  name: 'GalaxyMap',

  components: {
    SystemTile,
  },

  inject: ['game', 'bus', 'ui'],

  emits: ['update:width'],

  data() {
    return {
      containerWidth: 0,
      containerHeight: 0,
    }
  },

  computed: {
    systems() {
      return this.game.state.systems || {}
    },

    // Coordinate bounds in hex q,r space
    coordBounds() {
      const entries = Object.values(this.systems)
      if (entries.length === 0) {
        return { minQ: 0, maxQ: 0, minR: 0, maxR: 0 }
      }
      let minQ = Infinity, maxQ = -Infinity, minR = Infinity, maxR = -Infinity
      for (const sys of entries) {
        const { q, r } = sys.position
        // Pixel x = size * (sqrt3 * q + sqrt3/2 * r), so effective x-coord = sqrt3*q + sqrt3/2*r
        const xCoord = SQRT3 * q + SQRT3 / 2 * r
        const yCoord = 1.5 * r
        if (xCoord < minQ) {
          minQ = xCoord
        }
        if (xCoord > maxQ) {
          maxQ = xCoord
        }
        if (yCoord < minR) {
          minR = yCoord
        }
        if (yCoord > maxR) {
          maxR = yCoord
        }
      }
      return { minQ, maxQ, minR, maxR }
    },

    hexSize() {
      if (!this.containerHeight) {
        return 50
      }
      const { minR, maxR } = this.coordBounds
      const spanY = maxR - minR
      if (spanY === 0) {
        return 50
      }
      // Size hexes to fill the full container height
      return this.containerHeight / (spanY + 3)
    },

    contentWidth() {
      const { minQ, maxQ } = this.coordBounds
      return this.hexSize * (maxQ - minQ + 3)
    },

    viewportStyle() {
      if (!this.containerHeight) {
        return {}
      }
      const { minQ, maxQ, minR, maxR } = this.coordBounds
      const centerX = (minQ + maxQ) / 2 * this.hexSize
      const centerY = (minR + maxR) / 2 * this.hexSize
      const offsetX = this.contentWidth / 2 - centerX
      const offsetY = this.containerHeight / 2 - centerY
      return {
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }
    },

    highlightedSystems() {
      return this.ui?.highlightedSystems || []
    },

    interactiveSystems() {
      return this.ui?.interactiveSystems || []
    },

    hyperlaneLines() {
      const connections = this.game.state.hyperlaneConnections
      if (!connections) {
        return []
      }
      const size = this.hexSize
      return connections.map(([posA, posB]) => {
        return {
          x1: size * (SQRT3 * posA.q + SQRT3 / 2 * posA.r),
          y1: size * (1.5 * posA.r),
          x2: size * (SQRT3 * posB.q + SQRT3 / 2 * posB.r),
          y2: size * (1.5 * posB.r),
        }
      })
    },
  },

  watch: {
    contentWidth: {
      immediate: true,
      handler(w) {
        this.$emit('update:width', w)
      },
    },
  },

  methods: {
    isHighlighted(systemId) {
      return this.highlightedSystems.includes(systemId)
    },

    isInteractive(systemId) {
      return this.interactiveSystems.includes(systemId) || this.highlightedSystems.length === 0
    },

    handleSystemClick(systemId) {
      this.bus.emit('system-click', { systemId })
    },

    measure() {
      const el = this.$refs.wrapper
      if (el) {
        this.containerWidth = el.clientWidth
        this.containerHeight = el.clientHeight
      }
    },
  },

  mounted() {
    this.measure()
    this._resizeObserver = new ResizeObserver(() => this.measure()) // eslint-disable-line no-undef
    this._resizeObserver.observe(this.$refs.wrapper)
  },

  beforeUnmount() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect()
    }
  },
}
</script>

<style scoped>
.galaxy-map {
  flex: 1;
  overflow: hidden;
  background: #0a0a1a;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(50, 50, 100, .15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(100, 50, 50, .1) 0%, transparent 50%);
  position: relative;
}

.galaxy-viewport {
  position: relative;
}

.hyperlane-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

.hyperlane-connection {
  stroke: #6af;
  stroke-width: 2;
  stroke-dasharray: 6 4;
  opacity: 0.5;
}
</style>
