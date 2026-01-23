<template>
  <div class="settings-agricola">
    <div class="player-info">
      <span class="player-count">{{ playerCount }} player{{ playerCount !== 1 ? 's' : '' }}</span>
      <span class="player-range">(1-5 players supported)</span>
    </div>
  </div>
</template>


<script>
export default {
  name: 'SettingsAgricola',

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
      // Agricola supports 1-5 players
      const numPlayers = this.lobby.users.length
      const playersCondition = 1 <= numPlayers && numPlayers <= 5

      this.lobby.valid = playersCondition
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
.settings-agricola {
  padding: .5em;
}

.player-info {
  display: flex;
  align-items: center;
  gap: .5em;
}

.player-count {
  font-weight: 600;
}

.player-range {
  color: #666;
  font-size: .9em;
}
</style>
