<template>
  <div class="settings-twilight">
    <div class="player-info">
      <span class="player-count">{{ playerCount }} player{{ playerCount !== 1 ? 's' : '' }}</span>
      <span class="player-range">(3-6 players)</span>
    </div>

    <div class="setting-group">
      <label class="checkbox-label">
        <input type="checkbox" v-model="randomFactions" @change="save" />
        <span>Random Factions</span>
      </label>
      <span class="option-description">
        {{ randomFactions
          ? 'Factions are assigned randomly at game start'
          : 'Players choose factions during game setup' }}
      </span>
    </div>

    <div class="setting-group">
      <label class="checkbox-label">
        <input type="checkbox" v-model="useMapGenerator" @change="onGeneratorToggle" />
        <span>Use Map Generator</span>
      </label>
      <span class="option-description">
        {{ useMapGenerator
          ? 'Balanced tile placement using the map generator algorithm'
          : 'Tiles are shuffled randomly into a fixed layout' }}
      </span>
    </div>

    <template v-if="useMapGenerator">
      <div v-if="Object.keys(boardStyleOptions).length > 1" class="setting-group">
        <label class="select-label">Board Style</label>
        <select v-model="selectedBoardStyle" @change="saveGenerator" class="layout-select">
          <option v-for="(info, key) in boardStyleOptions" :key="key" :value="key">
            {{ key }}
          </option>
        </select>
        <span class="option-description">{{ boardStyleOptions[selectedBoardStyle]?.description }}</span>
      </div>

      <div class="setting-group">
        <label class="select-label">Tile Selection</label>
        <select v-model="selectedPickStyle" @change="saveGenerator" class="layout-select">
          <option value="balanced">Balanced</option>
          <option value="random">Random</option>
          <option value="resource">Resource-heavy</option>
          <option value="influence">Influence-heavy</option>
        </select>
      </div>

      <div v-if="generatorPreviewLayout" class="layout-preview">
        <div class="layout-label">Board Layout</div>
        <MapLayoutPreview :layout="generatorPreviewLayout" />
      </div>
    </template>

    <template v-else>
      <div v-if="layoutOptions.length > 1" class="setting-group">
        <label class="select-label">Map Layout</label>
        <select v-model="selectedLayout" @change="save" class="layout-select">
          <option v-for="opt in layoutOptions" :key="opt.key" :value="opt.key">
            {{ opt.name }}
          </option>
        </select>
      </div>

      <div v-if="currentLayout" class="layout-preview">
        <div class="layout-label">Board Layout</div>
        <MapLayoutPreview :layout="currentLayout" />
      </div>
      <div v-else class="layout-warning">
        No board layout available for {{ playerCount }} players.
      </div>
    </template>
  </div>
</template>

<script>
import { twilight } from 'battlestar-common'
import MapLayoutPreview from './MapLayoutPreview.vue'

const layouts = twilight.res.layouts
const getLayoutsForPlayerCount = twilight.res.getLayoutsForPlayerCount
const getGeneratorBoardStyles = twilight.res.getGeneratorBoardStyles
const getGeneratorPreviewLayout = twilight.res.getGeneratorPreviewLayout

export default {
  name: 'SettingsTwilight',
  inject: ['lobby', 'save'],
  components: { MapLayoutPreview },

  computed: {
    playerCount() {
      return this.lobby.users.length
    },
    layoutOptions() {
      const playerLayouts = getLayoutsForPlayerCount(this.playerCount)
      return Object.entries(playerLayouts).map(([key, layout]) => ({
        key,
        name: layout.name || 'Standard',
      }))
    },
    selectedLayout: {
      get() {
        return this.lobby.options?.mapLayout || String(this.playerCount)
      },
      set(value) {
        this.lobby.options.mapLayout = value
      },
    },
    currentLayout() {
      if (this.lobby.options?.mapLayout) {
        return layouts[this.lobby.options.mapLayout] || null
      }
      return layouts[this.playerCount] || null
    },
    randomFactions: {
      get() {
        return this.lobby.options?.randomFactions !== false
      },
      set(value) {
        this.lobby.options.randomFactions = value
      },
    },
    useMapGenerator: {
      get() {
        return !!this.lobby.options?.mapGenerator
      },
      set(value) {
        if (value) {
          this.lobby.options.mapGenerator = { boardStyle: 'normal', pickStyle: 'balanced' }
        }
        else {
          delete this.lobby.options.mapGenerator
        }
      },
    },
    boardStyleOptions() {
      return getGeneratorBoardStyles(this.playerCount)
    },
    selectedBoardStyle: {
      get() {
        return this.lobby.options?.mapGenerator?.boardStyle || 'normal'
      },
      set(value) {
        if (this.lobby.options?.mapGenerator) {
          this.lobby.options.mapGenerator.boardStyle = value
        }
      },
    },
    selectedPickStyle: {
      get() {
        return this.lobby.options?.mapGenerator?.pickStyle || 'balanced'
      },
      set(value) {
        if (this.lobby.options?.mapGenerator) {
          this.lobby.options.mapGenerator.pickStyle = value
        }
      },
    },
    generatorPreviewLayout() {
      return getGeneratorPreviewLayout(this.playerCount, this.selectedBoardStyle)
    },
  },

  watch: {
    'lobby.users': {
      handler() {
        this.updateValid()
      },
      deep: true,
    },
    playerCount() {
      // Reset layout selection when player count changes
      if (this.lobby.options?.mapLayout) {
        const available = getLayoutsForPlayerCount(this.playerCount)
        if (!available[this.lobby.options.mapLayout]) {
          delete this.lobby.options.mapLayout
          this.save()
        }
      }
      // Reset generator board style if not available for new player count
      if (this.lobby.options?.mapGenerator) {
        const styles = getGeneratorBoardStyles(this.playerCount)
        if (!styles[this.lobby.options.mapGenerator.boardStyle]) {
          this.lobby.options.mapGenerator.boardStyle = 'normal'
          this.save()
        }
      }
    },
  },

  methods: {
    updateValid() {
      this.lobby.valid = this.playerCount >= 3 && this.playerCount in layouts
    },
    onGeneratorToggle() {
      // Clear fixed layout when switching to generator
      if (this.useMapGenerator) {
        delete this.lobby.options.mapLayout
      }
      this.save()
    },
    saveGenerator() {
      this.save()
    },
  },

  created() {
    if (!this.lobby.options) {
      this.lobby.options = {}
    }
    this.updateValid()
  },
}
</script>

<style scoped>
.settings-twilight { padding: .5em; }
.player-info { display: flex; align-items: center; gap: .5em; margin-bottom: .5em; }
.player-count { font-weight: 600; }
.player-range { color: #666; font-size: .9em; }
.setting-group { margin: .5em 0; }
.checkbox-label { display: inline-flex; align-items: center; gap: .4em; cursor: pointer; }
.option-description { display: block; color: #888; font-size: .85em; margin-top: .15em; padding-left: 1.4em; }
.select-label { font-size: .9em; color: #aaa; display: block; margin-bottom: .25em; }
.layout-select {
  background: #222;
  color: #ddd;
  border: 1px solid #444;
  border-radius: 4px;
  padding: .3em .5em;
  font-size: .9em;
}
.layout-preview { margin-top: .75em; }
.layout-label { font-size: .85em; color: #aaa; margin-bottom: .25em; }
.layout-warning { margin-top: .75em; color: #c44; font-size: .9em; }
</style>
