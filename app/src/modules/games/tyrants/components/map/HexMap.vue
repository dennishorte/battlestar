<template>
  <div class="hex-map" :style="mapStyle">
    <div class="hex-container" :style="containerStyle">
      <HexTile
        v-for="hex in assembledHexes"
        :key="hex.tileId"
        :hex="hex"
        :hexSize="hexSize"
      />
    </div>
  </div>
</template>


<script>
import HexTile from './HexTile.vue'

export default {
  name: 'HexMap',

  components: {
    HexTile,
  },

  inject: ['game'],

  data() {
    return {
      hexSize: 120,  // Size of hex (center to vertex)
    }
  },

  computed: {
    assembledMap() {
      return this.game.state.assembledMap
    },

    assembledHexes() {
      if (!this.assembledMap) {
        return []
      }

      return this.assembledMap.hexes.map(hex => {
        const pixel = this.axialToPixel(hex.position.q, hex.position.r)
        return {
          ...hex,
          pixelX: pixel.x,
          pixelY: pixel.y,
          locations: this.getLocationsForHex(hex.tileId),
        }
      })
    },

    bounds() {
      if (this.assembledHexes.length === 0) {
        return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
      }

      const hexWidth = this.hexSize * Math.sqrt(3)
      const hexHeight = this.hexSize * 2

      let minX = Infinity
      let maxX = -Infinity
      let minY = Infinity
      let maxY = -Infinity

      for (const hex of this.assembledHexes) {
        minX = Math.min(minX, hex.pixelX - hexWidth / 2)
        maxX = Math.max(maxX, hex.pixelX + hexWidth / 2)
        minY = Math.min(minY, hex.pixelY - hexHeight / 2)
        maxY = Math.max(maxY, hex.pixelY + hexHeight / 2)
      }

      return { minX, maxX, minY, maxY }
    },

    containerStyle() {
      const padding = 40
      const width = this.bounds.maxX - this.bounds.minX + padding * 2
      const height = this.bounds.maxY - this.bounds.minY + padding * 2

      return {
        width: width + 'px',
        height: height + 'px',
        position: 'relative',
        transform: `translate(${-this.bounds.minX + padding}px, ${-this.bounds.minY + padding}px)`,
      }
    },

    mapStyle() {
      const padding = 40
      const width = this.bounds.maxX - this.bounds.minX + padding * 2
      const height = this.bounds.maxY - this.bounds.minY + padding * 2

      return {
        width: width + 'px',
        height: height + 'px',
        minWidth: width + 'px',
        minHeight: height + 'px',
        overflow: 'visible',
      }
    },
  },

  methods: {
    // Convert axial coordinates to pixel coordinates (pointy-top orientation)
    axialToPixel(q, r) {
      const x = this.hexSize * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r)
      const y = this.hexSize * (3 / 2 * r)
      return { x, y }
    },

    getLocationsForHex(tileId) {
      return this.game.getLocationAll().filter(loc => loc.hexId === tileId)
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
</style>
