<template>
  <div class="tyrants">
    <ChatOffCanvas :classes="chatClasses" :colors="chatColors" />

    <div class="container-fluid">
      <div class="row flex-nowrap main-row">
        <div class="col history-column">
          <GameMenu>
            <DropdownButton @click="openRules">rules</DropdownButton>
            <DropdownDivider />
            <DropdownButton @click="showScores">scores</DropdownButton>
          </GameMenu>

          <GameLog />
          <ChatInput />
        </div>

        <div class="col game-column">
          <Devoured />
          <Market />
          <WaitingPanel />
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

    <Modal id="tyrants-scores">
      <template #header>Score Overview</template>
      <ScoreTable />
    </Modal>
  </div>
</template>


<script>
import mitt from 'mitt'

import { nextTick } from 'vue'
import { util, tyr } from 'battlestar-common'

import maps from '../res/maps.js'

// Common Components
import ChatInput from '@/modules/games/common/components/ChatInput'
import ChatOffCanvas from '@/modules/games/common/components/ChatOffCanvas'
import DropdownButton from '@/components/DropdownButton'
import DropdownDivider from '@/components/DropdownDivider'
import GameMenu from '@/modules/games/common/components/GameMenu'
import WaitingPanel from '@/modules/games/common/components/WaitingPanel'

// Tyrants Components
import Devoured from './Devoured'
import GameLog from './log/GameLog'
import GameMap from './map/GameMap'
import Market from './Market'
import Player from './Player'
import ScoreTable from './ScoreTable'


// Modals
import CardViewerModal from './CardViewerModal'
import DebugModal from '@/modules/games/common/components/DebugModal'
import TableauModal from './TableauModal'

import Modal from '@/components/Modal'


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
    ChatOffCanvas,
    Devoured,
    DropdownButton,
    DropdownDivider,
    GameLog,
    GameMap,
    GameMenu,
    Market,
    Modal,
    Player,
    ScoreTable,
    WaitingPanel,

    CardViewerModal,
    DebugModal,
    TableauModal,
  },

  data() {
    return {
      bus: mitt(),

      ui: {
        fn: {
          clickLocation: this.clickLocation,
          getPlayerColor,
          getTroopColor,
          insertSelectorSubtitles: this.insertSelectorSubtitles,
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

  inject: [
    'actor',
    'game',
    'save',
  ],

  provide() {
    return {
      bus: this.bus,
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
    chatClasses() {
      if (!this.game.settings.chooseColors) {
        const output = {}
        for (const player of this.game.getPlayerAll()) {
          const color = getPlayerColor(this.game, player)
          output[player.name] = `${color}-element`
        }
        return output
      }
    },

    chatColors() {
      if (this.game.settings.chooseColors) {
        const output = {}

        for (const player of this.game.getPlayerAll()) {
          output[player.name] = player.color
        }

        return output
      }
    },

    devouredCount() {
      return this.game.getZoneById('devoured').cards().length
    },

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
    canPlaceTroopAtLocation(loc) {
      // Location requires empty space to place a troop
      if (loc.getEmptySpaces() === 0) {
        return false
      }

      // Player must have presence to place a troop
      const player = this.game.getPlayerCurrent()
      if (!this.game.getPresence(player).some(l => l === loc)) {
        return false
      }

      // Player must have the option to place a troop
      const usePowerOption = this
        .game
        .getWaiting()
        .selectors[0]
        .choices
        .find(c => c.title === 'Use Power')
      if (!usePowerOption) {
        return false
      }

      const deployOption = usePowerOption
        .choices
        .find(c => c === 'Deploy a Troop' || c.title === 'Deploy a Troop')

      return Boolean(deployOption)
    },

    async clickLocation(loc) {
      if (this.canPlaceTroopAtLocation(loc)) {
        this.game.respondToInputRequest({
          actor: this.actor.name,
          title: '__ALT_ACTION__',
          selection: [{
            action: 'place-troop-with-power',
            location: loc.name,
          }]
        })
        await this.save()
      }
      else {
        this.bus.emit('user-select-option', {
          actor: this.actor,
          optionName: loc.name,
          opts: { prefix: true },
        })
      }
    },

    insertSelectorSubtitles: function(selector) {
      if (selector.title === 'Choose cards to promote') {
        const updated = []
        for (const option of selector.choices) {
          const card = tyr.res.cards.byName[option][0]
          updated.push({
            title: option,
            subtitles: [`${card.points} / ${card.innerPoints}`],
          })
        }

        selector.choices = updated
      }
    },

    openRules() {
      window.open("https://tesera.ru/images/items/783812/Tyrants_Of_The_Underdark_Rulebook.pdf")
    },

    showScores() {
      this.$modal('tyrants-scores').show()
    },

    waitingMouseEntered(data) {
      // console.log('mouse-entered', data)
    },

    waitingMouseExited(data) {
      // console.log('mouse-exited', data)
    },

    waitingSelectionChanged(data) {
      // console.log('selection-changed', data)
    },
  },

  created() {
    this.bus.on('waiting-mouse-entered', this.waitingMouseEntered)
    this.bus.on('waiting-mouse-exited', this.waitingMouseExited)
    this.bus.on('waiting-selection-changed', this.waitingSelectionChanged)
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
  overflow-x: wrap;
  overflow-y: scroll;
  padding-bottom: 3em;
}

.map-column {
  height: calc(100vh - 60px);
  overflow: scroll;
  padding: 0;
}

.history-column {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  min-width: 400px;
  max-width: 400px;
  overflow: hidden;
}
</style>
