<template>
  <div class="settings-tyrants">

    Expansions (choose 2)

    <div class="form-check" v-for="expansion in expansions" :key="expansion">
      <input
        class="form-check-input"
        type="checkbox"
        :value="expansion.value"
        :disabled="expansion.disabled"
        v-model="models.expansions"
        @change="optionsChanged"
      />
      <label class="form-check-label">{{ expansion.text }}</label>
    </div>

    Map
    <div class="form-check" v-for="map in maps" :key="map">
      <input
        class="form-check-input"
        type="radio"
        v-model="models.map"
        :value="map.value"
        @change="optionsChanged"
      />
      <label class="form-check-label">{{ map.text }}</label>
    </div>
  </div>
</template>


<script>
export default {
  name: 'TyrantsSettings',

  inject: ['lobby', 'save'],

  data() {
    return {
      expansions: [
        {
          text: 'Demons',
          value: 'demons',
          disabled: false
        },
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
        {
          text: 'Elementals',
          value: 'elementals',
          disabled: false
        },
        {
          text: 'Illithid',
          value: 'illithid',
          disabled: false
        },
        {
          text: 'Undead',
          value: 'undead',
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
          disabled: true,
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
          disabled: true,
          minPlayers: 4,
          maxPlayers: 4,
        },
      ],

      models: {
        expansions: [],
        map: '',
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
      // Number of players must match map
      const map = this.maps.find(map => map.value === this.models.map)
      const numPlayers = this.lobby.users.length
      const mapAndPlayersCondition = (
        map
        && map.minPlayers <= numPlayers
        && map.maxPlayers >= numPlayers
      )

      // Exactly two expansions must be selected
      const expansionCondition = this.models.expansions.length === 2

      this.lobby.valid = mapAndPlayersCondition && expansionCondition
    },

    optionsChanged() {
      this.lobby.options = {
        expansions: [...this.models.expansions],
        map: this.models.map,
      }
      this.updateValid()
      this.save()
    },
  },

  created() {
    if (this.lobby.options) {
      this.models.expansions = [...this.lobby.options.expansions]
      this.models.map = this.lobby.options.map
      this.updateValid()
    }
    else {
      this.lobby.options = {}
      this.optionsChanged()  // Will grab the default options.
    }
  },
}
</script>
