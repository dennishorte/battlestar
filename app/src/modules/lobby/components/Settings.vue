<template>
<div class="lobby-settings">
  <div class="section-heading">
    Settings
  </div>

  <div class="game-picker">
    <b-form-select
      id="game-select"
      @change="gameSelected"
      v-model="settings.game"
      :options="gameNames">
    </b-form-select>
  </div>

  <div class="game-settings mt-2">

    <div v-if="settings.game === 'Battlestar Galactica'">
      No Additional Settings
    </div>

  </div>

</div>
</template>


<script>
import axios from 'axios'

export default {
  name: 'LobbySettings',

  props: {
    lobbyId: String,
    settingsIn: Object,
  },

  data() {
    return {
      gameNames: ['Battlestar Galactica'],
      settings: this.cloneSettings(),
    }
  },

  watch: {
    settingsIn: {
      handler: function() {
        this.cloneSettings()
      },
      deep: true,
    },
  },

  mounted() {
    console.log(this.settingsIn)
  },

  methods: {
    cloneSettings() {
      if (this.settingsIn && this.settingsIn.game) {
        return JSON.parse(JSON.stringify(this.settingsIn))
      }
      else {
        return {
          game: null,
          options: {},
        }
      }
    },

    async gameSelected() {
      await this.saveSettings()
    },

    async saveSettings() {
      await axios.post('/api/lobby/settings_update', {
        lobbyId: this.lobbyId,
        settings: {
          game: this.settings.game,
        },
      })
      this.$emit('settings-updated')
    },
  },
}
</script>
