<template>
  <div class="settings-dune">
    <div v-if="playerError" class="validation-error">{{ playerError }}</div>

    Modules

    <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        v-model="models.useBaseGameCards"
        @change="optionsChanged"
      />
      <label class="form-check-label">Base Game Imperium Cards</label>
    </div>

    <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        v-model="models.useRiseOfIx"
        @change="optionsChanged"
        disabled
      />
      <label class="form-check-label text-muted">Rise of Ix (not yet implemented)</label>
    </div>

    <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        v-model="models.useImmortality"
        @change="optionsChanged"
        disabled
      />
      <label class="form-check-label text-muted">Immortality (not yet implemented)</label>
    </div>

    <div class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        v-model="models.useBloodlines"
        @change="optionsChanged"
        disabled
      />
      <label class="form-check-label text-muted">Bloodlines (not yet implemented)</label>
    </div>

    <div class="mt-3">Imperium Row Refresh</div>

    <div class="form-check">
      <input
        class="form-check-input"
        type="radio"
        id="refresh-none"
        value="none"
        v-model="models.imperiumRowRefresh"
        @change="optionsChanged"
      />
      <label class="form-check-label" for="refresh-none">None (standard)</label>
    </div>

    <div class="form-check">
      <input
        class="form-check-input"
        type="radio"
        id="refresh-dice"
        value="dice"
        v-model="models.imperiumRowRefresh"
        @change="optionsChanged"
      />
      <label class="form-check-label" for="refresh-dice">
        Dice — roll two dice at round end; remove cards at matching positions (sixes do nothing; double sixes clear all)
      </label>
    </div>

    <div class="form-check">
      <input
        class="form-check-input"
        type="radio"
        id="refresh-nuke"
        value="nuke"
        v-model="models.imperiumRowRefresh"
        @change="optionsChanged"
      />
      <label class="form-check-label" for="refresh-nuke">
        Nuke — each player gets one nuke to clear and refill the Imperium Row
      </label>
    </div>

    <div class="form-check">
      <input
        class="form-check-input"
        type="radio"
        id="refresh-shift"
        value="shift"
        v-model="models.imperiumRowRefresh"
        @change="optionsChanged"
      />
      <label class="form-check-label" for="refresh-shift">
        Conveyor Belt — new cards always enter at the front; oldest card falls off at round end
      </label>
    </div>
  </div>
</template>


<script>
export default {
  name: 'SettingsDune',

  inject: ['lobby', 'save'],

  data() {
    return {
      playerError: '',
      models: {
        useBaseGameCards: true,
        useRiseOfIx: false,
        useImmortality: false,
        useBloodlines: false,
        imperiumRowRefresh: 'none',
      },
    }
  },

  computed: {
    playerCount() {
      return this.lobby.users?.length || 0
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
      if (this.playerCount < 3 || this.playerCount > 4) {
        this.playerError = 'Dune Imperium requires 3-4 players'
        this.lobby.valid = false
      }
      else {
        this.playerError = ''
        this.lobby.valid = true
      }
      this.save()
    },

    optionsChanged() {
      this.lobby.options = {
        useBaseGameCards: this.models.useBaseGameCards,
        useRiseOfIx: this.models.useRiseOfIx,
        useImmortality: this.models.useImmortality,
        useBloodlines: this.models.useBloodlines,
        imperiumRowRefresh: this.models.imperiumRowRefresh,
      }
      this.updateValid()
    },
  },

  created() {
    if (this.lobby.options) {
      this.models.useBaseGameCards = this.lobby.options.useBaseGameCards !== false
      this.models.useRiseOfIx = Boolean(this.lobby.options.useRiseOfIx)
      this.models.useImmortality = Boolean(this.lobby.options.useImmortality)
      this.models.useBloodlines = Boolean(this.lobby.options.useBloodlines)
      this.models.imperiumRowRefresh = this.lobby.options.imperiumRowRefresh || 'none'
    }
    else {
      this.lobby.options = {}
    }
    this.updateValid()
  },
}
</script>

<style scoped>
.validation-error {
  color: #d32f2f;
  font-size: .85em;
  margin-bottom: .5em;
}
</style>
