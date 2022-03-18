<template>
  <div class="innovation">
    <b-container fluid>
      <b-row class="main-row">

        <b-col class="game-column history-column">
          <History />
        </b-col>

        <b-col class="game-column">
          <Biscuits />
          <Decks />
          <Achievements />
          <WaitingPanel />
        </b-col>

        <b-col v-for="player in players" :key="player._id" class="game-column">
          <PlayerTableau :player="player" />
        </b-col>

      </b-row>
    </b-container>

    <CardsViewerModal />
  </div>
</template>


<script>
import axios from 'axios'
import Vue from 'vue'

import { inn } from 'battlestar-common'

import Achievements from './Achievements'
import Biscuits from './Biscuits'
import Decks from './Decks'
import History from './History'
import PlayerTableau from './PlayerTableau'
import WaitingPanel from './WaitingPanel'

// Modals
import CardsViewerModal from './CardsViewerModal'

export default {
  name: 'Innovation',

  components: {
    Achievements,
    Biscuits,
    Decks,
    History,
    PlayerTableau,
    WaitingPanel,

    // Modals
    CardsViewerModal,
  },

  props: {
    data: Object,
    actor: Object,
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
      actor: this.actor,
      game: this.game,
    }
  },

  created() {
    this.game.testMode = true

    Vue.set(this.game, 'ui', {
      modals: {
        cardsViewer: {
          cards: [],
        },
      },
    })

    this.game.saveLatest = async function() {
      const game = this.game
      const fakeSave = false

      if (fakeSave) {
        console.log('fake saved')
      }
      else {
        const lastResponse = game.responses.slice().reverse().find(r => r.isUserResponse)
        const payload = {
          gameId: game._id,
          response: lastResponse,
        }

        const requestResult = await axios.post('/api/game/saveResponse', payload)
        console.log(requestResult)

        if (requestResult.data.status === 'success') {
          this.$bvToast.toast('saved', {
            autoHideDelay: 300,
            noCloseButton: true,
            solid: true,
            variant: 'success',
          })
        }
        else {
          this.$bvToast.toast('error: see console', {
            autoHideDelay: 0,
            noCloseButton: false,
            solid: true,
            variant: 'danger',
          })
        }
      }
    }.bind(this)

    this.game.run()
  }
}
</script>

<style>
.innovation {
  width: 100vw;
  height: 100vh;
  font-size: .8rem;
  overflow: scroll;
}

.game-column {
  height: 100vh;
  min-width: 220px;
  max-width: 400px;
  overflow: scroll;
}

.history-column {
  min-width: 400px;
}

.main-row {
  flex-wrap: nowrap;
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
  background-color: #f5a2a2;
  border-color: #eb4545;
}

.yellow {
  background-color: #f9ffb9;
  border-color: #f3ff73;
}

.green {
  background-color: #baeaa4;
  border-color: #75d448;
}

.blue {
  background-color: #c8e4ff;
  border-color: #7eb8ee;
}

.purple {
  background-color: #decafa;
  border-color: #bd94f5;
}
</style>
