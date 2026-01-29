<template>
  <div class="tyrants">
    <div class="container-fluid">
      <div class="row flex-nowrap main-row">
        <div class="col history-column">
          <GameMenu>
            <DropdownButton @click="openRules">rules</DropdownButton>
            <DropdownDivider />
            <DropdownButton @click="showScores">scores</DropdownButton>
          </GameMenu>

          <GameLogTyrants />
        </div>

        <div class="col game-column">
          <DevouredZone />
          <MarketZone />
          <WaitingPanel />
        </div>

        <div class="col game-column">
          <PlayerTableau v-for="player in orderedPlayers" :key="player.name" :player="player" />
        </div>

        <div class="col map-column" :style="mapStyle">
          <GameMap />
        </div>

      </div>
    </div>

    <CardViewerModal />
    <DebugModal />
    <TableauModal />

    <ModalBase id="tyrants-scores">
      <template #header>Score Overview</template>
      <ScoreTable />
    </ModalBase>

  </div>
</template>


<script>
import { util } from 'battlestar-common'

import maps from '../res/maps.js'

// Common Components
import DropdownButton from '@/components/DropdownButton.vue'
import DropdownDivider from '@/components/DropdownDivider.vue'
import GameMenu from '@/modules/games/common/components/GameMenu.vue'
import WaitingPanel from '@/modules/games/common/components/WaitingPanel.vue'

// Tyrants Components
import DevouredZone from './DevouredZone.vue'
import GameLogTyrants from './GameLogTyrants.vue'
import GameMap from './map/GameMap.vue'
import MarketZone from './MarketZone.vue'
import PlayerTableau from './PlayerTableau.vue'
import ScoreTable from './ScoreTable.vue'


// Modals
import CardViewerModal from './CardViewerModal.vue'
import DebugModal from '@/modules/games/common/components/DebugModal.vue'
import TableauModal from './TableauModal.vue'

import ModalBase from '@/components/ModalBase.vue'


export default {
  name: 'TyrantsGame',

  components: {
    DevouredZone,
    DropdownButton,
    DropdownDivider,
    GameLogTyrants,
    GameMap,
    GameMenu,
    MarketZone,
    ModalBase,
    PlayerTableau,
    ScoreTable,
    WaitingPanel,

    CardViewerModal,
    DebugModal,
    TableauModal,
  },

  data() {
    return {
      ui: {
        fn: {
          clickLocation: this.clickLocation,
          insertSelectorSubtitles: this.insertSelectorSubtitles,
          troopStyle: this.troopStyle,
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

  inject: ['actor', 'bus', 'game'],

  provide() {
    return {
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
    devouredCount() {
      return this.game.zones.byId('devoured').cardlist().length
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
        const player = this.game.players.byName(this.actor.name)
        if (this.game.checkPlayerHasActionWaiting(player)) {
          return this.game.getWaiting(player)
        }
      }

      return undefined
    },

    orderedPlayers() {
      const viewingPlayer = this.game.players.byName(this.actor.name)
      return this.game.players.startingWith(viewingPlayer)
    },
  },

  methods: {
    canPlaceTroopAtLocation(loc) {
      // Location requires empty space to place a troop
      if (loc.getEmptySpaces() === 0) {
        return false
      }

      // Player must have presence to place a troop
      const player = this.game.players.current()
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
            location: loc.name(),
          }]
        })
        this.$store.dispatch('game/save')
      }
      else {
        this.bus.emit('user-select-option', {
          actor: this.actor,
          optionName: loc.name(),
          opts: { prefix: true },
        })
      }
    },

    // Subtitles are now provided by the game engine directly
    insertSelectorSubtitles: function() {},

    openRules() {
      window.open("https://tesera.ru/images/items/783812/Tyrants_Of_The_Underdark_Rulebook.pdf")
    },

    showScores() {
      this.$modal('tyrants-scores').show()
    },

    troopStyle(troop) {
      const player = this.game.players.byOwner(troop)
      if (player) {
        return { 'background-color': player.color }
      }
      else {
        return { 'background-color': 'gray' }
      }
    },

    // eslint-disable-next-line
    waitingMouseEntered(data) {
      // console.log('mouse-entered', data)
    },

    // eslint-disable-next-line
    waitingMouseExited(data) {
      // console.log('mouse-exited', data)
    },

    // eslint-disable-next-line
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
  overflow: auto;
}

.game-column {
  height: calc(100vh - 60px);
  min-width: 220px;
  max-width: 300px;
  overflow-x: wrap;
  overflow-y: auto;
  padding-bottom: 3em;
}

.map-column {
  height: calc(100vh - 60px);
  overflow: auto;
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

.tyrants:deep() .troop-space {
  height: 1.2em;
  width: 1.2em;
  border-radius: 50%;
  border: 1px solid black;
  margin: 1px;
}
</style>
