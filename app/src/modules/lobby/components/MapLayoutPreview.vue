<template>
  <svg :viewBox="viewBox" class="map-layout-preview">
    <polygon
      v-for="(hex, i) in hexes"
      :key="i"
      :points="hex.points"
      :class="hex.type"
      class="preview-hex"
    />
    <text
      v-for="(hex, i) in hexes"
      :key="'t' + i"
      :x="hex.cx"
      :y="hex.cy"
      class="hex-label"
      :class="hex.type"
    >{{ hex.label }}</text>
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

export default {
  name: 'MapLayoutPreview',
  props: {
    layout: { type: Object, required: true },
  },

  computed: {
    allPositions() {
      const { mecatol, homePositions, ring1, ring2 } = this.layout

      // Build ring3 positions (not already home or mecatol)
      const ring3Full = this.hexRing({ q: 0, r: 0 }, 3)
      const homeSet = new Set(homePositions.map(p => `${p.q},${p.r}`))
      const ring3 = ring3Full.filter(p => !homeSet.has(`${p.q},${p.r}`))

      return { mecatol, homePositions, ring1, ring2, ring3 }
    },

    hexes() {
      const { mecatol, homePositions, ring1, ring2, ring3 } = this.allPositions
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
        })
      })

      // Interior tiles (ring1 + ring2 + ring3 remainder)
      const interiorPositions = [...ring1, ...ring2, ...ring3]
      interiorPositions.forEach(pos => {
        const p = hexToPixel(pos.q, pos.r)
        result.push({
          cx: p.x, cy: p.y,
          points: hexCorners(p.x, p.y),
          type: 'hex-interior',
          label: '',
        })
      })

      return result
    },

    viewBox() {
      if (this.hexes.length === 0) return '0 0 100 100'
      const pad = HEX_SIZE + 2
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
      for (const h of this.hexes) {
        if (h.cx < minX) minX = h.cx
        if (h.cy < minY) minY = h.cy
        if (h.cx > maxX) maxX = h.cx
        if (h.cy > maxY) maxY = h.cy
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
</style>
