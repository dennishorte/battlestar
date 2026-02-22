<template>
  <div class="galaxy-map-wrapper" ref="wrapper">
    <div
      class="galaxy-map"
      :style="mapStyle"
      @mousedown="onPanStart"
      @wheel.prevent="onZoom"
    >
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
          :highlighted="isHighlighted(systemId)"
          :interactive="isInteractive(systemId)"
          @click="handleSystemClick"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SystemTile from './SystemTile.vue'

export default {
  name: 'GalaxyMap',

  components: {
    SystemTile,
  },

  inject: ['game', 'bus', 'ui'],

  data() {
    return {
      zoom: 1,
      panX: 0,
      panY: 0,
      isPanning: false,
      panStartX: 0,
      panStartY: 0,
      panStartPanX: 0,
      panStartPanY: 0,
    }
  },

  computed: {
    systems() {
      return this.game.state.systems || {}
    },

    mapStyle() {
      return {
        cursor: this.isPanning ? 'grabbing' : 'grab',
      }
    },

    viewportStyle() {
      return {
        transform: `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`,
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
      const HEX_SIZE = 50
      const posToPixel = (q, r) => ({
        x: HEX_SIZE * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r),
        y: HEX_SIZE * (3 / 2 * r),
      })
      // Build position→system lookup
      const posSystems = {}
      for (const [, sys] of Object.entries(this.systems)) {
        if (!sys.isHyperlane) {
          posSystems[`${sys.position.q},${sys.position.r}`] = sys.position
        }
      }
      return connections.map(([posA, posB]) => {
        const a = posToPixel(posA.q, posA.r)
        const b = posToPixel(posB.q, posB.r)
        return { x1: a.x, y1: a.y, x2: b.x, y2: b.y }
      })
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

    onPanStart(e) {
      // Only pan on middle-click or when not clicking on a tile
      if (e.button === 1 || e.target.classList.contains('galaxy-map')) {
        this.isPanning = true
        this.panStartX = e.clientX
        this.panStartY = e.clientY
        this.panStartPanX = this.panX
        this.panStartPanY = this.panY
        window.addEventListener('mousemove', this.onPanMove)
        window.addEventListener('mouseup', this.onPanEnd)
      }
    },

    onPanMove(e) {
      if (!this.isPanning) {
        return
      }
      this.panX = this.panStartPanX + (e.clientX - this.panStartX)
      this.panY = this.panStartPanY + (e.clientY - this.panStartY)
    },

    onPanEnd() {
      this.isPanning = false
      window.removeEventListener('mousemove', this.onPanMove)
      window.removeEventListener('mouseup', this.onPanEnd)
    },

    onZoom(e) {
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      this.zoom = Math.max(0.3, Math.min(2.5, this.zoom + delta))
    },
  },

  mounted() {
    // Center the viewport on mount
    const wrapper = this.$refs.wrapper
    if (wrapper) {
      this.panX = wrapper.clientWidth / 2
      this.panY = wrapper.clientHeight / 2
    }
  },

  beforeUnmount() {
    window.removeEventListener('mousemove', this.onPanMove)
    window.removeEventListener('mouseup', this.onPanEnd)
  },
}
</script>

<style scoped>
.galaxy-map-wrapper {
  flex: 1;
  overflow: hidden;
  background: #0a0a1a;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(50, 50, 100, .15) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(100, 50, 50, .1) 0%, transparent 50%);
  position: relative;
}

.galaxy-map {
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
}

.galaxy-viewport {
  transform-origin: 0 0;
  transition: none;
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
