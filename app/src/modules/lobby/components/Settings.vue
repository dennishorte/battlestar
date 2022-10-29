<template>
  <div class="lobby-settings">
    <div class="section-heading">
      Settings
    </div>

    <div class="game-picker">
      <select
        id="game-select"
        @change="gameUpdated"
        v-model="game"
        class="form-select"
      >
        <option v-for="name in gameNames" :value="name">{{ name }}</option>
      </select>
    </div>

    <div class="game-options mt-2">

      <SettingsInnovation
        v-if="game === 'Innovation'"
        :options-in="options"
        @settings-updated="settingsUpdated"
      />

      <SettingsTyrants
        v-if="game === 'Tyrants of the Underdark'"
        :options-in="options"
        @settings-updated="settingsUpdated"
      />

    </div>

  </div>
</template>


<script>
import { util } from 'battlestar-common'

import SettingsInnovation from './SettingsInnovation'
import SettingsTyrants from './SettingsTyrants'


export default {
  name: 'LobbySettings',

  components: {
    SettingsInnovation,
    SettingsTyrants,
  },

  props: {
    lobbyId: String,
    gameIn: String,
    options: Object,
  },

  data() {
    return {
      gameNames: [
        'Innovation',
        'Tyrants of the Underdark',
      ],
      game: this.gameIn,
    }
  },

  watch: {
    gameIn: function(val) {
      this.game = val
    },
  },

  methods: {
    gameUpdated() {
      console.log(this.game)
    },

    // Just a pass-through function
    settingsUpdated(options) {
      this.$emit('settings-updated', options)
    },
  },
}
</script>
