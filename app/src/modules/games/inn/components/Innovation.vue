<template>
  <div class="innovation">
    <b-container>
      <b-row>
        <b-col class="game-log">

          <div class="selector">
            <WaitingPanel />
          </div>

          <div>
            <History />
          </div>
        </b-col>

        <b-col>
          Board
        </b-col>

      </b-row>
    </b-container>
  </div>
</template>


<script>
import axios from 'axios'

import { inn } from 'battlestar-common'

import History from './History'
import WaitingPanel from './WaitingPanel'

export default {
  name: 'Innovation',

  components: {
    History,
    WaitingPanel,
  },

  props: {
    data: Object,
    actor: Object
  },

  data() {
    return {
      game: new inn.Innovation(this.data, this.actor.name),
    }
  },

  provide() {
    return {
      game: this.game,
    }
  },

  created() {
    this.game.testMode = true

    this.game.saveLatest = async function() {
      const game = this.game
      const payload = {
        gameId: game._id,
        response: game.responses[game.responses.length - 1],
      }

      const requestResult = await axios.post('/api/game/saveResponse', payload)
      console.log(requestResult)
    }.bind(this)

    /* this.game.save = async function() {
     *   const requestResult = await axios.post('/api/game/save', this.game.serialized())
     *   if (requestResult.data.status !== 'success') {
     *     this.ui.modal.error = requestResult.data.message
     *   }
     *   else {
     *     this.toaster('saved')
     *     this.state.saveKey = requestResult.data.saveKey
     *   }
     * }.bind(this.game)

     * this.game.toaster = function(msg) {
     *   this.$bvToast.toast(msg, {
     *     autoHideDelay: 300,
     *     noCloseButton: true,
     *     solid: true,
     *   })
     * }.bind(this)
     */
    this.game.run()
  }
}
</script>

<style>
.innovation {
  background-color: cyan;
  width: 100%;
}

</style>
