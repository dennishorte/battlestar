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
          <Biscuits />
          <Decks />
          <Achievements />
        </b-col>

        <b-col v-for="player in players" :key="player._id">
          {{ player.name }}

          <ColorStack
            v-for="color in game.utilColors()"
            :key="color"
            :player="player"
            :color="color"
          />

          <CardPile
            v-for="zoneName in ['achievements', 'score', 'forecast', 'hand']"
            :key="zoneName"
            :zone="game.getZoneByPlayer(player, zoneName)"
          />
        </b-col>

      </b-row>
    </b-container>
  </div>
</template>


<script>
import axios from 'axios'

import { inn } from 'battlestar-common'

import Achievements from './Achievements'
import Biscuits from './Biscuits'
import CardPile from './CardPile'
import ColorStack from './ColorStack'
import Decks from './Decks'
import History from './History'
import WaitingPanel from './WaitingPanel'

export default {
  name: 'Innovation',

  components: {
    Achievements,
    Biscuits,
    CardPile,
    ColorStack,
    Decks,
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

  computed: {
    players() {
      return this.game.getPlayersStarting(this.viewer)
    },
    viewer() {
      return this.game.getPlayerByName(this.actor.name)
    },
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
      const fakeSave = true

      if (fakeSave) {
        console.log('fake saved')
      }
      else {
        const payload = {
          gameId: game._id,
          response: game.responses[game.responses.length - 1],
        }

        const requestResult = await axios.post('/api/game/saveResponse', payload)
        console.log(requestResult)
      }
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
  width: 100%;
  height: 100vh;
  font-size: .8rem;
}

.game-log {
  height: 100vh;
  overflow: scroll;
}

.selector {
  position: sticky;
  top: 0;
}

.text-base {
  color: #bba37a;
}

.text-echo {
  color: #6889ec;
}

.text-figs {
  color: #519432;
}

.text-city {
  color: #cc0000;
}

.text-arti {
  color: #9532a8;
}

.bg-base {
  background-color: #bba37a;
}

.bg-echo {
  background-color: #6889ec;
}

.bg-figs {
  background-color: #519432;
}

.bg-city {
  background-color: #cc0000;
}

.bg-arti {
  background-color: #9532a8;
}

.red {
  background-color: #eb4545;
}

.yellow {
  background-color: #f3ff73;
}

.green {
  background-color: #75d448;
}

.blue {
  background-color: #7eb8ee;
}

.purple {
  background-color: #bd94f5;
}
</style>
