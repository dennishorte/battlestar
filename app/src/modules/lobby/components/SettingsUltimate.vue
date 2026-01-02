<template>
  <div class="settings-ultimate">
    <div class="row">
      <div class="col">
        <div class="form-check" v-for="expansion in expansions" :key="expansion.value">
          <input
            class="form-check-input"
            type="checkbox"
            :value="models.randomizeExpansions ? false : expansion.value"
            v-model="models.expansions"
            :disabled="models.randomizeExpansions ? true : expansion.disabled"
            @change="optionsChanged"
          />
          <label class="form-check-label">{{ expansion.text }}</label>
        </div>
      </div>
      <div class="col">
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            v-model="models.randomizeExpansions"
            @change="optionsChanged"
          />
          <label class="form-check-label">randomize expansions</label>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'UltimateSettings',

  inject: ['lobby', 'save'],

  data() {
    return {
      expansions: [
        {
          text: 'Base Game',
          value: 'base',
          disabled: true,
        },
        {
          text: 'Echoes of the Past',
          value: 'echo',
          disabled: false,
        },
        {
          text: 'Figures in the Sand',
          value: 'figs',
          disabled: false,
        },
        {
          text: 'Cities of Destiny',
          value: 'city',
          disabled: false,
        },
        {
          text: 'Artifacts of History',
          value: 'arti',
          disabled: false,
        },
        {
          text: 'The Unseen',
          value: 'usee',
          disabled: false,
        },
      ],

      models: {
        expansions: ['base'],
        randomizeExpansions: false,
      },
    }
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
      // Number of players is between 2 and 4
      const numPlayers = this.lobby.users.length
      const playersCondition = 2 <= numPlayers && numPlayers <= 4

      this.lobby.valid = playersCondition
    },

    optionsChanged() {
      this.lobby.options = {
        expansions: this.models.randomizeExpansions ? [] : this.models.expansions,
        randomizeExpansions: this.models.randomizeExpansions,
      }
      this.updateValid()
      this.save()
    },
  },

  created() {
    if (this.lobby.options) {
      this.models.expansions = [...this.lobby.options.expansions]
      this.models.randomizeExpansions = Boolean(this.lobby.options.randomizeExpansions)
      this.updateValid()
    }
    else {
      this.lobby.options = {}
      this.optionsChanged()  // Will grab the default options.
    }
  },
}
</script>
