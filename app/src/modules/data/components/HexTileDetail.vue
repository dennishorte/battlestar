<template>
  <div class="hex-tile-detail">
    <GameHeader />

    <div class="container-fluid">
      <div class="header-row">
        <router-link to="/data/tyrants/hexTiles" class="back-link">
          &larr; Back to Tiles
        </router-link>
        <h2>{{ tile ? tile.id : 'Loading...' }}</h2>
        <button
          v-if="isAdmin && !editMode"
          class="btn btn-primary"
          @click="enterEditMode"
        >
          Edit
        </button>
        <button
          v-if="editMode"
          class="btn btn-secondary"
          @click="exitEditMode"
        >
          Exit Edit
        </button>
      </div>

      <div v-if="tile" class="detail-content">
        <div class="tile-view-section">
          <TileEditor
            v-if="editMode"
            :tile="tile"
            :hexSize="200"
          />
          <ViewerHexTile
            v-else
            :tile="tile"
            :hexSize="150"
          />
        </div>

        <div class="metadata-section">
          <h3>Tile Information</h3>
          <table class="metadata-table">
            <tr>
              <th>ID</th>
              <td>{{ tile.id }}</td>
            </tr>
            <tr>
              <th>Category</th>
              <td>{{ tile.category }}</td>
            </tr>
            <tr>
              <th>Region</th>
              <td>{{ tile.region }}</td>
            </tr>
            <tr>
              <th>Special Rules</th>
              <td>{{ tile.specialRules ? JSON.stringify(tile.specialRules) : 'None' }}</td>
            </tr>
          </table>

          <h3>Locations ({{ tile.locations.length }})</h3>
          <table class="locations-table">
            <thead>
              <tr>
                <th>Short</th>
                <th>Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Neutrals</th>
                <th>Points</th>
                <th>Start</th>
                <th>Control</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="loc in tile.locations" :key="loc.short">
                <td>{{ loc.short }}</td>
                <td>{{ loc.name }}</td>
                <td>{{ getLocationType(loc) }}</td>
                <td>{{ loc.size }}</td>
                <td>{{ loc.neutrals }}</td>
                <td>{{ loc.points }}</td>
                <td>{{ loc.start ? 'Yes' : '' }}</td>
                <td>{{ formatControl(loc) }}</td>
                <td>{{ formatPosition(loc.position) }}</td>
              </tr>
            </tbody>
          </table>

          <h3>Paths ({{ tile.paths.length }})</h3>
          <ul class="paths-list">
            <li v-for="(path, index) in tile.paths" :key="index">
              {{ path[0] }} &harr; {{ path[1] }}
            </li>
          </ul>

          <h3>Edge Connections ({{ tile.edgeConnections.length }})</h3>
          <table class="edges-table">
            <thead>
              <tr>
                <th>Edge</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="conn in tile.edgeConnections" :key="conn.edge">
                <td>{{ conn.edge }}</td>
                <td>{{ conn.location }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="not-found">
        Tile not found: {{ tileId }}
      </div>
    </div>
  </div>
</template>


<script>
import { tyrants } from 'battlestar-common'
import GameHeader from '@/components/GameHeader.vue'
import ViewerHexTile from './ViewerHexTile.vue'
import TileEditor from '@/modules/games/tyrants/components/tileEditor/TileEditor.vue'

export default {
  name: 'HexTileDetail',

  components: {
    GameHeader,
    ViewerHexTile,
    TileEditor,
  },

  props: {
    tileId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      editMode: false,
    }
  },

  computed: {
    tile() {
      return tyrants.res.hexTiles.allTiles[this.tileId]
    },

    isAdmin() {
      const user = this.$store.getters['auth/user']
      return user && user.name === 'dennis'
    },
  },

  methods: {
    getLocationType(loc) {
      if (loc.points === 0) {
        return 'Tunnel'
      }
      if (loc.control && loc.control.influence > 0) {
        return 'Major Site'
      }
      return 'Site'
    },

    formatControl(loc) {
      if (!loc.control || loc.control.influence === 0) {
        return '-'
      }
      return `${loc.control.influence}/${loc.control.points}`
    },

    formatPosition(pos) {
      if (!pos) {
        return '-'
      }
      return `(${pos.x.toFixed(2)}, ${pos.y.toFixed(2)})`
    },

    enterEditMode() {
      this.editMode = true
    },

    exitEditMode() {
      this.editMode = false
    },
  },
}
</script>


<style scoped>
.hex-tile-detail {
  padding-bottom: 2em;
}

.header-row {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 1em;
}

.header-row h2 {
  flex: 1;
  margin: 0;
}

.back-link {
  color: #8b4513;
}

.detail-content {
  display: flex;
  gap: 2em;
}

.tile-view-section {
  flex: 0 0 auto;
  padding: 1em;
  background: #1a1a1a;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  min-width: 340px;
  min-height: 300px;
}

.metadata-section {
  flex: 1;
}

.metadata-section h3 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  color: #8b4513;
  border-bottom: 1px solid #333;
  padding-bottom: 0.3em;
}

.metadata-section h3:first-child {
  margin-top: 0;
}

.metadata-table,
.locations-table,
.edges-table {
  width: 100%;
  border-collapse: collapse;
}

.metadata-table th,
.metadata-table td,
.locations-table th,
.locations-table td,
.edges-table th,
.edges-table td {
  padding: 0.4em 0.8em;
  text-align: left;
  border-bottom: 1px solid #333;
}

.metadata-table th,
.locations-table th,
.edges-table th {
  background: #252525;
  color: #d4a574;
  font-weight: 500;
}

.locations-table td,
.edges-table td {
  font-family: monospace;
  font-size: 0.9em;
}

.paths-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
}

.paths-list li {
  background: #252525;
  padding: 0.3em 0.6em;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}

.not-found {
  padding: 2em;
  text-align: center;
  color: #999;
}
</style>
