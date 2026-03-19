<template>
  <div class="galaxy-wrapper">
    <div class="galaxy-main" ref="wrapper">
      <div class="galaxy-viewport" :style="viewportStyle">
        <!-- Hyperlane route paths -->
        <svg v-if="hyperlanePaths.length > 0" class="hyperlane-overlay">
          <defs>
            <filter id="hyperlane-glow"
                    filterUnits="userSpaceOnUse"
                    x="-10000"
                    y="-10000"
                    width="20000"
                    height="20000">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            v-for="(p, i) in hyperlanePaths"
            :key="'glow' + i"
            :d="p.d"
            class="hyperlane-glow"
          />
          <path
            v-for="(p, i) in hyperlanePaths"
            :key="i"
            :d="p.d"
            class="hyperlane-route"
          />
        </svg>

        <SystemTile
          v-for="(system, systemId) in onMapSystems"
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

    <div class="offmap-panel" v-if="offMapSystemEntries.length > 0">
      <div class="offmap-label">Off-Map</div>
      <div class="offmap-tiles">
        <div
          v-for="[systemId, system] in offMapSystemEntries"
          :key="'offmap-' + systemId"
          class="offmap-tile-container"
        >
          <SystemTile
            :systemId="systemId"
            :system="system"
            :hexSize="40"
            :highlighted="isHighlighted(systemId)"
            :interactive="isInteractive(systemId)"
            @click="handleSystemClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SystemTile from './SystemTile.vue'

const SQRT3 = Math.sqrt(3)

// Midpoint of hex edge in direction dir (0=E, 1=SE, 2=SW, 3=W, 4=NW, 5=NE)
function edgeMidpoint(cx, cy, size, dir) {
  const a1 = (Math.PI / 180) * (60 * dir - 30)
  const a2 = (Math.PI / 180) * (60 * ((dir + 1) % 6) - 30)
  return {
    x: cx + size * (Math.cos(a1) + Math.cos(a2)) / 2,
    y: cy + size * (Math.sin(a1) + Math.sin(a2)) / 2,
  }
}

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

    onMapSystems() {
      const result = {}
      for (const [id, sys] of Object.entries(this.systems)) {
        if (sys.position.q < 50 && sys.position.r < 50) {
          result[id] = sys
        }
      }
      return result
    },

    offMapSystemEntries() {
      const entries = []
      for (const [id, sys] of Object.entries(this.systems)) {
        if (sys.position.q >= 50 || sys.position.r >= 50) {
          entries.push([id, sys])
        }
      }
      return entries
    },

    // Coordinate bounds in hex q,r space
    coordBounds() {
      const entries = Object.values(this.onMapSystems)
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

    hyperlanePaths() {
      const routes = this.game.state.hyperlaneRoutes
      if (!routes) {
        return []
      }
      const size = this.hexSize
      const paths = []
      for (const [posKey, edgePairs] of Object.entries(routes)) {
        const [q, r] = posKey.split(',').map(Number)
        const cx = size * (SQRT3 * q + SQRT3 / 2 * r)
        const cy = size * (1.5 * r)
        for (const [dirA, dirB] of edgePairs) {
          const a = edgeMidpoint(cx, cy, size, dirA)
          const b = edgeMidpoint(cx, cy, size, dirB)
          // Straight if opposite edges (direction diff of 3), curved otherwise
          const isOpposite = Math.abs(dirA - dirB) === 3
          const d = isOpposite
            ? `M${a.x},${a.y} L${b.x},${b.y}`
            : `M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`
          paths.push({ d })
        }
      }
      return paths
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
.galaxy-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.galaxy-main {
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

.hyperlane-glow {
  fill: none;
  stroke: #48f;
  stroke-width: 8;
  stroke-linecap: round;
  opacity: 0.25;
  filter: url(#hyperlane-glow);
}

.hyperlane-route {
  fill: none;
  stroke: #8bf;
  stroke-width: 2;
  stroke-linecap: round;
  opacity: 0.8;
}

.offmap-panel {
  background: #111122;
  border-top: 1px solid #334;
  padding: .35em .5em;
  display: flex;
  align-items: center;
  gap: .75em;
}

.offmap-label {
  color: #889;
  font-size: .75em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .05em;
  white-space: nowrap;
}

.offmap-tiles {
  display: flex;
  gap: .5em;
}

.offmap-tile-container {
  position: relative;
  width: 80px;
  height: 80px;
}

.offmap-tile-container :deep(.system-tile) {
  transform: none !important;
  margin-left: 0 !important;
  margin-top: 0 !important;
}
</style>
