<template>
  <svg :viewBox="viewBox" class="map-layout-preview">
    <polygon
      v-for="(hex, i) in hexes"
      :key="i"
      :points="hex.points"
      :class="hex.type"
      class="preview-hex"
    />
    <!-- Route paths inside hyperlane hexes -->
    <path
      v-for="(p, i) in routePaths"
      :key="'rt' + i"
      :d="p.d"
      class="hyperlane-route"
    />

    <text
      v-for="(hex, i) in hexes"
      :key="'t' + i"
      :x="hex.cx"
      :y="hex.bonus ? hex.cy - 3 : hex.cy"
      class="hex-label"
      :class="hex.type"
    >{{ hex.label }}</text>
    <text
      v-for="(hex, i) in bonusHexes"
      :key="'b' + i"
      :x="hex.cx"
      :y="hex.cy + 6"
      class="hex-label hex-bonus"
    >+{{ hex.bonus }}TG</text>
  </svg>
</template>

<script>
const HEX_SIZE = 20
const SQRT3 = Math.sqrt(3)

function hexToPixel(q, r) {
  return {
    x: HEX_SIZE * (SQRT3 * q + SQRT3 / 2 * r),
    y: HEX_SIZE * (1.5 * r),
  }
}

function hexCorners(cx, cy) {
  const points = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30)
    points.push(`${cx + HEX_SIZE * Math.cos(angle)},${cy + HEX_SIZE * Math.sin(angle)}`)
  }
  return points.join(' ')
}

// Midpoint of hex edge in direction dir (0=E, 1=SE, 2=SW, 3=W, 4=NW, 5=NE).
// Edge dir connects corner[dir] and corner[(dir+1)%6].
function edgeMidpoint(cx, cy, dir) {
  const a1 = (Math.PI / 180) * (60 * dir - 30)
  const a2 = (Math.PI / 180) * (60 * ((dir + 1) % 6) - 30)
  return {
    x: cx + HEX_SIZE * (Math.cos(a1) + Math.cos(a2)) / 2,
    y: cy + HEX_SIZE * (Math.sin(a1) + Math.sin(a2)) / 2,
  }
}

export default {
  name: 'MapLayoutPreview',
  props: {
    layout: { type: Object, required: true },
  },

  computed: {
    allPositions() {
      const { mecatol, homePositions, ring1, ring2, outerPositions, hyperlanePositions } = this.layout

      const homeSet = new Set(homePositions.map(p => `${p.q},${p.r}`))
      const hyperlaneSet = new Set((hyperlanePositions || []).map(p => `${p.q},${p.r}`))
      const outerRaw = outerPositions || this.hexRing({ q: 0, r: 0 }, 3)
      const ring3 = outerRaw.filter(p =>
        !homeSet.has(`${p.q},${p.r}`) && !hyperlaneSet.has(`${p.q},${p.r}`)
      )

      return { mecatol, homePositions, ring1, ring2, ring3, hyperlanePositions: hyperlanePositions || [] }
    },

    hexes() {
      const { mecatol, homePositions, ring1, ring2, ring3, hyperlanePositions } = this.allPositions
      const result = []

      // Mecatol Rex
      const mc = hexToPixel(mecatol.q, mecatol.r)
      result.push({
        cx: mc.x, cy: mc.y,
        points: hexCorners(mc.x, mc.y),
        type: 'hex-mecatol',
        label: 'MR',
      })

      // Home systems
      homePositions.forEach((pos, idx) => {
        const p = hexToPixel(pos.q, pos.r)
        result.push({
          cx: p.x, cy: p.y,
          points: hexCorners(p.x, p.y),
          type: 'hex-home',
          label: `P${idx + 1}`,
          bonus: pos.bonusTradeGoods || 0,
        })
      })

      // Interior tiles (ring1 + ring2 + ring3 remainder)
      const hyperlaneSet = new Set(hyperlanePositions.map(p => `${p.q},${p.r}`))
      const interiorPositions = [...ring1, ...ring2, ...ring3].filter(
        p => !hyperlaneSet.has(`${p.q},${p.r}`)
      )
      interiorPositions.forEach(pos => {
        const p = hexToPixel(pos.q, pos.r)
        result.push({
          cx: p.x, cy: p.y,
          points: hexCorners(p.x, p.y),
          type: 'hex-interior',
          label: '',
        })
      })

      // Hyperlane tiles
      hyperlanePositions.forEach(pos => {
        const p = hexToPixel(pos.q, pos.r)
        result.push({
          cx: p.x, cy: p.y,
          points: hexCorners(p.x, p.y),
          type: 'hex-hyperlane',
          label: '',
        })
      })

      return result
    },

    routePaths() {
      const routes = this.layout.hyperlaneRoutes
      if (!routes) {
        return []
      }
      const paths = []
      for (const [posKey, edgePairs] of Object.entries(routes)) {
        const [q, r] = posKey.split(',').map(Number)
        const center = hexToPixel(q, r)
        for (const [dirA, dirB] of edgePairs) {
          const a = edgeMidpoint(center.x, center.y, dirA)
          const b = edgeMidpoint(center.x, center.y, dirB)
          const isOpposite = Math.abs(dirA - dirB) === 3
          const d = isOpposite
            ? `M${a.x},${a.y} L${b.x},${b.y}`
            : `M${a.x},${a.y} Q${center.x},${center.y} ${b.x},${b.y}`
          paths.push({ d })
        }
      }
      return paths
    },

    bonusHexes() {
      return this.hexes.filter(h => h.bonus)
    },

    viewBox() {
      if (this.hexes.length === 0) {
        return '0 0 100 100'
      }
      const pad = HEX_SIZE + 2
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      for (const h of this.hexes) {
        if (h.cx < minX) {
          minX = h.cx
        }
        if (h.cy < minY) {
          minY = h.cy
        }
        if (h.cx > maxX) {
          maxX = h.cx
        }
        if (h.cy > maxY) {
          maxY = h.cy
        }
      }
      return `${minX - pad} ${minY - pad} ${maxX - minX + pad * 2} ${maxY - minY + pad * 2}`
    },
  },

  methods: {
    hexRing(center, radius) {
      const HEX_DIRECTIONS = [
        { q: 1, r: 0 },
        { q: 0, r: 1 },
        { q: -1, r: 1 },
        { q: -1, r: 0 },
        { q: 0, r: -1 },
        { q: 1, r: -1 },
      ]
      const results = []
      let q = center.q + HEX_DIRECTIONS[4].q * radius
      let r = center.r + HEX_DIRECTIONS[4].r * radius
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < radius; j++) {
          results.push({ q, r })
          q += HEX_DIRECTIONS[i].q
          r += HEX_DIRECTIONS[i].r
        }
      }
      return results
    },
  },
}
</script>

<style scoped>
.map-layout-preview {
  width: 100%;
  max-width: 300px;
  height: auto;
}

.preview-hex {
  stroke: #444;
  stroke-width: 0.5;
}
.preview-hex.hex-mecatol {
  fill: #c8a415;
}
.preview-hex.hex-home {
  fill: #4a8;
}
.preview-hex.hex-interior {
  fill: #1a3050;
}
.preview-hex.hex-hyperlane {
  fill: transparent;
  stroke: transparent;
}

.hex-label {
  font-size: 8px;
  text-anchor: middle;
  dominant-baseline: central;
  pointer-events: none;
}
.hex-label.hex-mecatol {
  fill: #000;
  font-weight: 700;
}
.hex-label.hex-home {
  fill: #fff;
  font-weight: 600;
}
.hex-label.hex-bonus {
  fill: #fd6;
  font-size: 6px;
}

.hyperlane-route {
  fill: none;
  stroke: #8bf;
  stroke-width: 1.5;
  stroke-linecap: round;
  opacity: 0.8;
}
</style>
