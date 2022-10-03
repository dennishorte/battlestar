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

    <div v-if="game === 'Innovation'">
      <b-form-checkbox-group
        @change="settingsUpdated"
        v-model="options.inn.expansions"
        :options="other.inn.expansions"
        stacked
      >

      </b-form-checkbox-group>
    </div>

    <div v-if="game === 'Tyrants of the Underdark'">
      <b-form-checkbox-group
        @change="settingsUpdated"
        v-model="options.tyr.expansions"
        :options="other.tyr.expansions"
        stacked
      >

      </b-form-checkbox-group>
    </div>

  </div>

</div>
</template>


<script>
import { util } from 'battlestar-common'

export default {
  name: 'LobbySettings',

  props: {
    lobbyId: String,
    gameIn: String,
    optionsIn: Object,
  },

  data() {
    return {
      gameNames: [
        'Innovation',
        'Tyrants of the Underdark',
      ],
      game: this.gameIn,

      other: {
        inn: {
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
        },

        tyr: {
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
        },
      },

      options: {
        inn: {
          expansions: ['base'],
        },
        tyr: {
          expansions: []
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
        if (this.game === 'Innovation') {
          this.options.inn = util.deepcopy(this.optionsIn)
        }
        else if (this.game === 'Tyrants of the Underdark') {
          this.options.tyr = util.deepcopy(this.optionsIn)
        }
      },
      deep: true,
    },
  },

  methods: {
    settingsUpdated() {
      const options = this.game === 'Innovation' ? this.options.inn : this.options.tyr
      this.$emit('settings-updated', {
        game: this.game,
        options,
      })
    },
  },
}
</script>
