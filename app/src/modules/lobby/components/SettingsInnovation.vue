<template>
  <div class="settings-innovation">
    <div class="form-check" v-for="expansion in expansions" :key="expansion">
      <input class="form-check-input" type="checkbox" :value="expansion.value" v-model="models.expansions" />
      <label class="form-check-label">{{ expansion.text }}</label>
    </div>
  </div>
</template>


<script>
import { util } from 'battlestar-common'


export default {
  name: 'InnovationSettings',

  props: {
    optionsIn: Object,
  },

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
    optionsIn: {
      handler: function() {
        this.models = util.deepcopy(this.optionsIn)
      },
      deep: true,
    },
  },

  methods: {
    settingsUpdated() {
      this.$emit('settings-updated', {
        game: this.game,
        options: this.models
      })
    },
  },
}
</script>
