<template>
  <div class="settings-tyrants">

    Expansions (choose 2)

    <div class="form-check" v-for="expansion in options.expansions" :key="expansion">
      <input
        class="form-check-input"
        type="checkbox"
        :value="expansion.value"
        v-model="models.expansions"
        @click="settingsUpdated"
      />
      <label class="form-check-label">{{ expansion.text }}</label>
    </div>

    Map
    <div class="form-check" v-for="map in options.maps" :key="map">
      <input class="form-check-input" type="radio" v-model="models.map" :value="map.value" />
      <label class="form-check-label">{{ map.text }}</label>
    </div>
  </div>
</template>


<script>
import { util } from 'battlestar-common'


export default {
  name: 'TyrantsSettings',

  props: {
    optionsIn: Object,
  },

  data() {
    return {
      options: {
        expansions: [
          {
            text: 'Dragons',
            value: 'dragons',
            disabled: false
          },
          {
            text: 'Drow',
            value: 'drow',
            disabled: false
          },
        ],

        maps: [
          {
            text: 'base-2',
            value: 'base-2',
            disabled: false,
            minPlayers: 2,
            maxPlayers: 2,
          },
          {
            text: 'base-3a',
            value: 'base-3a',
            disabled: false,
            minPlayers: 3,
            maxPlayers: 3,
          },
          {
            text: 'base-3b',
            value: 'base-3b',
            disabled: false,
            minPlayers: 3,
            maxPlayers: 3,
          },
          {
            text: 'base-4',
            value: 'base-4',
            disabled: false,
            minPlayers: 4,
            maxPlayers: 4,
          },
        ]
      },

      models: {
        expansions: [],
        map: ''
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
        game: 'Tyrants of the Underdark',
        options: this.models
      })
    },
  },
}
</script>
