<template>
  <div class="settings-agricola">
    <div class="player-info">
      <span class="player-count">{{ playerCount }} player{{ playerCount !== 1 ? 's' : '' }}</span>
      <span class="player-range">(1-5 players supported)</span>
    </div>

    <div class="draft-option">
      <label class="checkbox-label">
        <input type="checkbox" v-model="useDrafting" @change="save" />
        <span>Card Drafting</span>
      </label>
      <span class="option-description">Draft occupations and minor improvements instead of random deal</span>
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

    useDrafting: {
      get() {
        return this.lobby.options?.useDrafting || false
      },
      set(value) {
        if (!this.lobby.options) {
          this.lobby.options = {}
        }
        this.lobby.options.useDrafting = value
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
  margin-bottom: .75em;
}

.player-count {
  font-weight: 600;
}

.player-range {
  color: #666;
  font-size: .9em;
}

.draft-option {
  display: flex;
  flex-direction: column;
  gap: .25em;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: .5em;
  cursor: pointer;
}

.checkbox-label input {
  cursor: pointer;
}

.option-description {
  color: #666;
  font-size: .85em;
  margin-left: 1.5em;
}
</style>
