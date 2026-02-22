<template>
  <div class="settings-twilight">
    <div class="player-info">
      <span class="player-count">{{ playerCount }} player{{ playerCount !== 1 ? 's' : '' }}</span>
      <span class="player-range">(3-6 players supported)</span>
    </div>
    <div class="setting-note">
      Factions are assigned randomly at game start.
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsTwilight',
  inject: ['lobby', 'save'],

  computed: {
    playerCount() {
      return this.lobby.users.length
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
      const numPlayers = this.lobby.users.length
      this.lobby.valid = numPlayers >= 3 && numPlayers <= 6
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
.setting-note { color: #888; font-size: .85em; }
</style>
