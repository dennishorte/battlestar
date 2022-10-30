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

  methods: {
    optionsChanged() {
      this.lobby.options = {
        expansions: [...this.models.expansions],
      }
      this.save()
    },
  },

  created() {
    if (this.lobby.options) {
      this.models.expansions = [...this.lobby.options.expansions]
    }
    else {
      this.lobby.options = {}
      this.optionsChanged()  // Will grab the default options.
    }
  },
}
</script>
