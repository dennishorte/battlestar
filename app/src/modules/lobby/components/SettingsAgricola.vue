<template>
  <div class="settings-agricola">
    <div class="player-info">
      <span class="player-count">{{ playerCount }} player{{ playerCount !== 1 ? 's' : '' }}</span>
      <span class="player-range">(1-6 players supported)</span>
    </div>

    <div class="setting-group">
      <div class="setting-label">Card Sets</div>
      <div class="card-sets">
        <label
          v-for="set in availableCardSets"
          :key="set.id"
          class="checkbox-label"
        >
          <input
            type="checkbox"
            :value="set.id"
            v-model="selectedCardSets"
            @change="onCardSetsChanged"
          />
          <span>{{ set.name }}</span>
          <span class="set-count">({{ set.minorCount }} minor, {{ set.occupationCount }} occupations)</span>
        </label>
      </div>
      <div v-if="cardSetError" class="validation-error">{{ cardSetError }}</div>
    </div>

    <div class="setting-group">
      <label class="checkbox-label">
        <input type="checkbox" v-model="useDrafting" @change="save" />
        <span>Card Drafting</span>
      </label>
      <span class="option-description">Draft occupations and minor improvements instead of random deal</span>
    </div>
  </div>
</template>


<script>
import { agricola } from 'battlestar-common'

const res = agricola.res

export default {
  name: 'SettingsAgricola',

  inject: ['lobby', 'save'],

  data() {
    return {
      cardSetError: '',
    }
  },

  computed: {
    playerCount() {
      return this.lobby.users.length
    },

    availableCardSets() {
      return Object.values(res.cardSets).filter(set => !set.hidden)
    },

    selectedCardSets: {
      get() {
        return this.lobby.options?.cardSets || res.getSelectableCardSetIds()
      },
      set(value) {
        if (!this.lobby.options) {
          this.lobby.options = {}
        }
        this.lobby.options.cardSets = [...value]
      },
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
    onCardSetsChanged() {
      this.updateValid()
      this.save()
    },

    updateValid() {
      const numPlayers = this.lobby.users.length
      const playersCondition = 1 <= numPlayers && numPlayers <= 6

      const setIds = this.selectedCardSets
      if (setIds.length === 0) {
        this.cardSetError = 'At least one card set must be selected'
        this.lobby.valid = false
        return
      }

      const validation = res.validateCardSets(setIds, numPlayers)
      if (!validation.valid) {
        this.cardSetError = validation.errors[0]
        this.lobby.valid = false
        return
      }

      this.cardSetError = ''
      this.lobby.valid = playersCondition
    },
  },

  created() {
    if (!this.lobby.options) {
      this.lobby.options = {}
    }
    if (!this.lobby.options.cardSets) {
      this.lobby.options.cardSets = res.getSelectableCardSetIds()
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

.setting-group {
  margin-bottom: .75em;
}

.setting-label {
  font-weight: 500;
  margin-bottom: .35em;
}

.card-sets {
  display: flex;
  flex-direction: column;
  gap: .25em;
  margin-left: .25em;
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

.set-count {
  color: #888;
  font-size: .85em;
}

.option-description {
  color: #666;
  font-size: .85em;
  margin-left: 1.5em;
}

.validation-error {
  color: #d32f2f;
  font-size: .85em;
  margin-top: .25em;
  margin-left: .25em;
}
</style>
