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

    <div v-if="currentLayout" class="layout-preview">
      <div class="layout-label">Board Layout</div>
      <MapLayoutPreview :layout="currentLayout" />
    </div>
    <div v-else class="layout-warning">
      No board layout available for {{ playerCount }} players.
    </div>
  </div>
</template>

<script>
import { twilight } from 'battlestar-common'
import MapLayoutPreview from './MapLayoutPreview.vue'

const layouts = twilight.res.layouts

export default {
  name: 'SettingsTwilight',
  inject: ['lobby', 'save'],
  components: { MapLayoutPreview },

  computed: {
    playerCount() {
      return this.lobby.users.length
    },
    currentLayout() {
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
  },

  watch: {
    'lobby.users': {
      handler() {
        this.updateValid()
      },
      deep: true,
    },
  },

  methods: {
    updateValid() {
      this.lobby.valid = this.playerCount >= 3 && this.playerCount in layouts
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
.layout-preview { margin-top: .75em; }
.layout-label { font-size: .85em; color: #aaa; margin-bottom: .25em; }
.layout-warning { margin-top: .75em; color: #c44; font-size: .9em; }
</style>
