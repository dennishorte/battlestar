<template>
  <div class="hex-tile" :style="tileStyle">
    <svg class="hex-svg" :viewBox="svgViewBox" :style="svgStyle">
      <polygon
        :points="hexPoints"
        class="hex-polygon"
        :class="{ rotated: hex.rotation > 0 }"
      />
      <text
        class="hex-label"
        x="0"
        y="0"
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
    tileStyle() {
      const width = this.hexSize * Math.sqrt(3)
      const height = this.hexSize * 2

      return {
        position: 'absolute',
        left: (this.hex.pixelX - width / 2) + 'px',
        top: (this.hex.pixelY - height / 2) + 'px',
        width: width + 'px',
        height: height + 'px',
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
      const width = this.hexSize * Math.sqrt(3)
      const height = this.hexSize * 2
      return `${-width / 2} ${-height / 2} ${width} ${height}`
    },

    hexPoints() {
      // Pointy-top hex vertices
      const points = []
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2  // Start from top
        const x = this.hexSize * Math.cos(angle)
        const y = this.hexSize * Math.sin(angle)
        points.push(`${x},${y}`)
      }
      return points.join(' ')
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

.locations-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
