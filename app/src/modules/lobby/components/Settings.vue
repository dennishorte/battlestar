<template>
<div class="lobby-settings">
  <div class="section-heading">
    Settings
  </div>

  <div class="game-picker">
    <b-form-select
      id="game-select"
      @change="gameSelected"
      v-model="game"
      :options="gameNames">
    </b-form-select>
  </div>

  <div class="game-options mt-2">

    <div v-if="game === 'Battlestar Galactica'">
      No Game Options
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
    gameIn: String,
    optionsIn: Object,
  },

  data() {
    return {
      gameNames: ['Battlestar Galactica'],
      game: this.gameIn,
      options: this.cloneOptions(),
    }
  },

  watch: {
    gameIn: function(val) {
      this.game = val
    },

    optionsIn: {
      handler: function() {
        this.cloneOptions()
      },
      deep: true,
    },
  },

  methods: {
    cloneOptions() {
      if (this.optionsIn) {
        return JSON.parse(JSON.stringify(this.optionsIn))
      }
      else {
        return {}
      }
    },

    async gameSelected() {
      await this.save()
    },

    async save() {
      await axios.post('/api/lobby/settings_update', {
        lobbyId: this.lobbyId,
        game: this.game,
        options: this.options,
      })
      this.$emit('settings-updated')
    },
  },
}
</script>
