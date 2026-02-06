<template>
  <div class="hex-tiles-viewer">
    <GameHeader />

    <div class="container-fluid">
      <h2>Hex Tiles</h2>

      <div v-for="category in categories" :key="category" class="category-section">
        <h3>Category {{ category }}</h3>
        <div class="tiles-grid">
          <div
            v-for="tile in tilesByCategory[category]"
            :key="tile.id"
            class="tile-card"
            @click="viewTile(tile.id)"
          >
            <div class="tile-container">
              <ViewerHexTile :tile="tile" :hexSize="80" />
            </div>
            <div class="tile-info">
              <div class="tile-id">{{ tile.id }}</div>
              <div class="tile-region">{{ tile.region }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { tyrants } from 'battlestar-common'
import GameHeader from '@/components/GameHeader.vue'
import ViewerHexTile from './ViewerHexTile.vue'

export default {
  name: 'HexTilesViewer',

  components: {
    GameHeader,
    ViewerHexTile,
  },

  data() {
    return {
      categories: ['A', 'B', 'C', 'X'],
    }
  },

  computed: {
    tilesByCategory() {
      return tyrants.res.hexTiles.byCategory
    },
  },

  methods: {
    viewTile(tileId) {
      this.$router.push(`/data/tyrants/hexTiles/${tileId}`)
    },
  },
}
</script>


<style scoped>
.hex-tiles-viewer {
  padding-bottom: 2em;
}

.category-section {
  margin-bottom: 2em;
}

.category-section h3 {
  margin-bottom: 1em;
  color: #8b4513;
  border-bottom: 1px solid #8b4513;
  padding-bottom: 0.3em;
}

.tiles-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
}

.tile-card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 0.5em;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.tile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
  border-color: #8b4513;
}

.tile-container {
  width: 160px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.tile-info {
  text-align: center;
  padding-top: 0.5em;
  border-top: 1px solid #333;
  margin-top: 0.5em;
}

.tile-id {
  font-weight: bold;
  font-size: 1.1em;
  color: #d4a574;
}

.tile-region {
  font-size: 0.85em;
  color: #888;
}
</style>
