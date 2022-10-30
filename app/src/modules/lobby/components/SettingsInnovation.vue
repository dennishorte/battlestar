<template>
  <div class="settings-innovation">
    <div class="form-check" v-for="expansion in expansions" :key="expansion.value">
      <input
        class="form-check-input"
        type="checkbox"
        :value="expansion.value"
        v-model="models.expansions"
        :disabled="expansion.disabled"
        @change="optionsChanged"
      />
      <label class="form-check-label">{{ expansion.text }}</label>
    </div>
  </div>
</template>


<script>
import { util } from 'battlestar-common'


export default {
  name: 'InnovationSettings',

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
        }
      ],

      models: {
        expansions: ['base'],
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
        expansions: [...this.models.expansions],
      }
      this.updateValid()
      this.save()
    },
  },

  created() {
    if (this.lobby.options) {
      this.models.expansions = [...this.lobby.options.expansions]
      this.updateValid()
    }
    else {
      this.lobby.options = {}
      this.optionsChanged()  // Will grab the default options.
    }
  },
}
</script>
