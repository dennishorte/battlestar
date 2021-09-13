<template>
<div class="lobby-settings">
  <div class="section-heading">
    Settings
  </div>

  <div class="game-picker">
    <b-form-select
      id="game-select"
      @change="settingsUpdated"
      v-model="game"
      :options="gameNames">
    </b-form-select>
  </div>

  <div class="game-options mt-2">

    <div v-if="game === 'Battlestar Galactica'">
      <b-form-checkbox-group
        @change="settingsUpdated"
        v-model="options.bsg.expansions"
        :options="other.bsg.expansions"
      >

      </b-form-checkbox-group>
    </div>

  </div>

</div>
</template>


<script>
import util from '@/util.js'

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

      other: {
        bsg: {
          expansions: [
            {
              text: 'Base Game',
              value: 'base game',
              disabled: true,
            },
            {
              text: 'Pegasus',
              value: 'pegasus',
              disabled: true,
            },
            {
              text: 'Exodus',
              value: 'exodus',
              disabled: true,
            },
            {
              text: 'Daybreak',
              value: 'daybreak',
              disabled: true,
            },
          ],
        },
      },

      options: {
        bsg: {
          expansions: ['base game'],
        },
      },
    }
  },

  watch: {
    gameIn: function(val) {
      this.game = val
    },

    optionsIn: {
      handler: function() {
        if (this.game === 'Battlestar Galactica') {
          this.options.bsg = util.deepcopy(this.optionsIn)
        }
      },
      deep: true,
    },
  },

  methods: {
    /* save() {
     *   this.$emit('settings-save')
     * },
     */
    settingsUpdated() {
      this.$emit('settings-updated', {
        game: this.game,
        options: this.options.bsg,
      })
    },
  },
}
</script>
