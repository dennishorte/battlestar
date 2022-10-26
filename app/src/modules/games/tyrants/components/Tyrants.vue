<template>
  <div class="tyrants">
    <b-container fluid>
      <b-row class="main-row">
        <b-col class="game-column history-column">
          <GameMenu>
            <b-dropdown-item @click="openRules">rules</b-dropdown-item>
          </GameMenu>

          <GameLog />
        </b-col>

        <b-col class="game-column">
          <Market />
          <WaitingPanel />
        </b-col>

        <b-col class="game-column">
          <Player v-for="player in orderedPlayers" :key="player.name" :player="player" />
        </b-col>

        <b-col class="map-column" :style="mapStyle">
          <GameMap />
        </b-col>

      </b-row>
    </b-container>

    <CardViewerModal />
    <DebugModal />
  </div>
</template>


<script>
import Vue from 'vue'
import axios from 'axios'

import { tyr } from 'battlestar-common'

import maps from '../res/maps.js'

// Primary Components
import GameMenu from '@/modules/games/common/components/GameMenu'
import WaitingPanel from '@/modules/games/common/components/WaitingPanel'

import GameLog from './log/GameLog'
import GameMap from './map/GameMap'
import Market from './Market'
import Player from './Player'


// Modals
import CardViewerModal from './CardViewerModal'
import DebugModal from '@/modules/games/common/components/DebugModal'


function getTroopColor(game, troop) {
  if (troop.owner === undefined) {
    return 'neutral'
  }
  else {
    return getPlayerColor(game, troop.owner)
  }
}


function getPlayerColor(game, player) {
  const seatNumber = game.getPlayerAll().indexOf(player)
  switch (seatNumber) {
    case 0: return 'red';
    case 1: return 'blue';
    case 2: return 'green';
    case 3: return 'yellow';
  }

  throw new Error(`Unsupported seat number for color selection: ${seatNumber}`)
}

export default {
  name: 'Tyrants',

  components: {
    GameLog,
    GameMap,
    GameMenu,
    Market,
    Player,
    WaitingPanel,

    CardViewerModal,
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

      bus: new Vue(),

      ui: {
        fn: {
          clickLocation: this.clickLocation,
          getPlayerColor,
          getTroopColor,
        },
        modals: {
          cardViewer: {
            cardId: '',
          },
        },
        selectable: [],
      },
    }
  },

  provide() {
    return {
      actor: this.actor,
      bus: this.bus,
      game: this.game,
      ui: this.ui,
    }
  },

  watch: {
    optionSelector() {
      if (this.optionSelector) {
        this.ui.selectable = this.optionSelector.choices.map(c => c.title || c)
      }
      else {
        this.ui.selectable = []
      }
    }
  },

  computed: {
    mapStyle() {
      const parsePx = (px) => parseInt(px.substr(0, px.length - 2))
      const elemMeta = maps[this.game.settings.map].elemMeta
      const mapStyle = elemMeta.styles['.map']

      // const height = parsePx(mapStyle.height)
      const width = parsePx(mapStyle.width)

      return {
        // minHeight: height + 'px',
        minWidth: width + 'px',
      }
    },

    optionSelector() {
      if (this.game.state.initializationComplete) {
        const player = this.game.getPlayerByName(this.actor.name)
        if (this.game.checkPlayerHasActionWaiting(player)) {
          return this.game.getWaiting(player)
        }
      }

      return undefined
    },

    orderedPlayers() {
      const viewingPlayer = this.game.getPlayerByName(this.actor.name)
      return this.game.getPlayersStarting(viewingPlayer)
    },
  },

  methods: {
    clickLocation(loc) {
      this.bus.$emit('user-select-option', loc.name)
    },

    handleSaveResult(result) {
      console.log(result)

      if (result.data.status === 'success') {
        this.game.usedUndo = false

        this.$bvToast.toast('saved', {
          autoHideDelay: 1000,
          noCloseButton: true,
          solid: true,
          variant: 'success',
        })
      }
      else {
        this.$bvToast.toast('error: see console', {
          autoHideDelay: 999999,
          noCloseButton: false,
          solid: true,
          variant: 'danger',
        })
      }
    },

    openRules() {
      window.open("https://media.dnd.wizards.com/TyrantsOfTheUnderdark-Rulebook.pdf")
    },

    save: async function() {
      if (this.fakeSave) {
        console.log('fake saved (game)')
        return
      }

      await this.saveFull()
    },

    saveFull: async function() {
      const game = this.game
      const payload = {
        gameId: game._id,
        responses: game.responses,
        chat: game.getChat(),
      }
      const requestResult = await axios.post('/api/game/saveFull', payload)
      this.handleSaveResult(requestResult)
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

    waitingMouseEntered(data) {
      console.log('mouse-entered', data)
    },

    waitingMouseExited(data) {
      console.log('mouse-exited', data)
    },

    waitingSelectionChanged(data) {
      console.log('selection-changed', data)
    },
  },

  created() {
    this.bus.$on('waiting-mouse-entered', this.waitingMouseEntered)
    this.bus.$on('waiting-mouse-exited', this.waitingMouseExited)
    this.bus.$on('waiting-selection-changed', this.waitingSelectionChanged)

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
  overflow: scroll;
  padding: 0;
}

.history-column {
  min-width: 400px;
}
</style>
