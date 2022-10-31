<template>
  <div class="tyrants">
    <div class="container-fluid">
      <div class="row flex-nowrap main-row">
        <div class="col game-column history-column">
          <GameMenu>
            <DropdownItem>
              <button @click="openRules">rules</button>
            </DropdownItem>
          </GameMenu>

          <GameLog />
        </div>

        <div class="col game-column">
          <Market />
          <WaitingPanel />
          <ChatInput />
        </div>

        <div class="col game-column">
          <Player v-for="player in orderedPlayers" :key="player.name" :player="player" />
        </div>

        <div class="col map-column" :style="mapStyle">
          <GameMap />
        </div>

      </div>
    </div>

    <CardViewerModal />
    <DebugModal />
    <Tableau-Modal />
  </div>
</template>


<script>
import axios from 'axios'
import mitt from 'mitt'

import { util, tyr } from 'battlestar-common'

import maps from '../res/maps.js'

// Common Components
import ChatInput from '@/modules/games/common/components/ChatInput'
import DropdownItem from '@/components/DropdownItem'
import GameMenu from '@/modules/games/common/components/GameMenu'
import WaitingPanel from '@/modules/games/common/components/WaitingPanel'

// Tyrants Components
import GameLog from './log/GameLog'
import GameMap from './map/GameMap'
import Market from './Market'
import Player from './Player'


// Modals
import CardViewerModal from './CardViewerModal'
import DebugModal from '@/modules/games/common/components/DebugModal'
import TableauModal from './TableauModal'


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
    ChatInput,
    DropdownItem,
    GameLog,
    GameMap,
    GameMenu,
    Market,
    Player,
    WaitingPanel,

    CardViewerModal,
    DebugModal,
    TableauModal,
  },

  props: {
    data: Object,
    actor: Object,
  },

  data() {
    return {
      game: new tyr.Tyrants(this.data, this.actor.name),
      fakeSave: false,

      bus: mitt(),

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
          tableau: {
            player: '',
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
        this.ui.selectable = this.optionSelector.choices.flatMap(c => {
          const name = c.title || c
          const tokens = name.split(',').map(t => t.trim())
          return util.array.distinct([name, tokens[0]])
        })
      }
      else {
        this.ui.selectable = []
      }
    },
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
      this.bus.emit('user-select-option', loc.name, { prefix: true })
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
    this.bus.on('waiting-mouse-entered', this.waitingMouseEntered)
    this.bus.on('waiting-mouse-exited', this.waitingMouseExited)
    this.bus.on('waiting-selection-changed', this.waitingSelectionChanged)

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
