<template>
  <div class="tyrants">
    <b-container fluid>
      <b-row class="main-row">
        <b-col class="game-column history-column">
          <GameMenu>
            <b-dropdown-item @click="openRules">rules</b-dropdown-item>
          </GameMenu>
        </b-col>

        <b-col class="game-column">
          <Player v-for="player in orderedPlayers" :key="player.name" :player="player" />

          <Market />
          <WaitingPanel />
        </b-col>

        <b-col class="map-column">
          <GameMap />
        </b-col>

      </b-row>
    </b-container>

    <DebugModal />
  </div>
</template>


<script>
import Vue from 'vue'

import { tyr } from 'battlestar-common'

// Primary Components
import GameMenu from '@/modules/games/common/components/GameMenu'
import WaitingPanel from '@/modules/games/common/components/WaitingPanel'

import GameMap from './GameMap'
import Market from './Market'
import Player from './Player'


// Modals
import DebugModal from '@/modules/games/common/components/DebugModal'

export default {
  name: 'Tyrants',

  components: {
    GameMap,
    GameMenu,
    Market,
    Player,
    WaitingPanel,

    DebugModal,
  },

  props: {
    data: Object,
    actor: Object,
  },

  data() {
    return {
      game: new tyr.Tyrants(this.data, this.actor.name),
      fakeSave: false,
    }
  },

  provide() {
    return {
      actor: this.actor,
      game: this.game,
      ui: {},
    }
  },

  computed: {
    orderedPlayers() {
      const viewingPlayer = this.game.getPlayerByName(this.actor.name)
      return this.game.getPlayersStarting(viewingPlayer)
    },
  },

  methods: {
    openRules() {
      window.open("https://media.dnd.wizards.com/TyrantsOfTheUnderdark-Rulebook.pdf")
    },

    save: async function() {
      /* if (this.fakeSave) {
       *   console.log('fake saved (game)')
       *   return
       * }

       * await this.saveFull() */
      console.log('saved')
    },

    _injectChatMethod() {
      const mChatOrigFunc = this.game.mChat
      this.game.mChat = async function(...args) {
        mChatOrigFunc.apply(this.game, args)
        await this.save()
      }.bind(this)
    },

    _injectSaveMethod() {
      this.game.save = async function() {
        await this.save()
      }.bind(this)
    },
  },

  created() {
    this.game.testMode = true

    Vue.set(this.game, 'ui', {
      modals: {
        achievement: {
          card: '',
        },
        cardsViewer: {
          cards: [],
          title: '',
        },
      },
    })

    this._injectChatMethod()
    this._injectSaveMethod()
    this.game.run()
  },

  mounted() {
    document.title = this.game.settings.name || 'Game Center'
  },
}
</script>


<style scoped>
.tyrants {
  width: 100vw;
  height: calc(100vh - 60px);
  font-size: .8rem;
  overflow: scroll;
}

.game-column {
  height: calc(100vh - 60px);
  min-width: 220px;
  max-width: 300px;
  overflow: scroll;
}

.map-column {
  height: calc(100vh - 60px);
  min-width: 220px;
  max-width: 600px;
  overflow: scroll;
}

.history-column {
  min-width: 400px;
}
</style>
