<template>
  <div class="tyrants">
    <div class="container-fluid">
      <div class="row flex-nowrap main-row">
        <div class="col history-column">
          <GameMenu>
            <DropdownButton @click="openRules">rules</DropdownButton>
            <DropdownDivider />
            <DropdownButton @click="showScores">scores</DropdownButton>
            <DropdownDivider />
            <DropdownButton @click="toggleMapActions">
              map actions: {{ ui.mapActions ? 'on' : 'off' }}
            </DropdownButton>
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
          clickTroop: this.clickTroop,
          clickSpy: this.clickSpy,
          insertSelectorSubtitles: this.insertSelectorSubtitles,
          isUnitSelectable: this.isUnitSelectable,
          troopStyle: this.troopStyle,
        },
        mapActions: window.localStorage.getItem('tyrants-map-actions') === 'true',
        modals: {
          cardViewer: {
            cardId: '',
          },
          tableau: {
            player: '',
          },
        },
        selectable: [],
        selectableUnits: [],
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
        const unitTargets = []
        const locationTargets = []

        for (const c of this.optionSelector.choices) {
          const name = c.title || c
          const tokens = name.split(',').map(t => t.trim())

          if (typeof c === 'string' && tokens.length === 2 && this.game.getLocationByName(tokens[0])) {
            // "LocationName, OwnerName" — unit-level target only
            unitTargets.push(name)
          }
          else if (c.title === 'troop' || c.title === 'spy') {
            // Nested group with unit targets only
            for (const sub of (c.choices || [])) {
              unitTargets.push(sub)
            }
          }
          else {
            locationTargets.push(name)
            const locPart = tokens[0]
            if (locPart !== name) {
              locationTargets.push(locPart)
            }
          }
        }

        this.ui.selectableUnits = util.array.distinct(unitTargets)
        this.ui.selectable = util.array.distinct(locationTargets)
      }
      else {
        this.ui.selectable = []
        this.ui.selectableUnits = []
      }
    },
  },

  computed: {
    devouredCount() {
      return this.game.zones.byId('devoured').cardlist().length
    },

    isDemonwebMap() {
      const mapName = this.game.settings.map
      return mapName && mapName.startsWith('demonweb')
    },

    mapStyle() {
      if (this.isDemonwebMap) {
        // Demonweb maps are dynamically sized
        return {
          minWidth: '600px',
        }
      }

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
      else if (this.ui.mapActions && this.matchLocationInSelector(loc)) {
        this.game.respondToInputRequest(this.matchLocationInSelector(loc))
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

    toggleMapActions() {
      this.ui.mapActions = !this.ui.mapActions
      window.localStorage.setItem('tyrants-map-actions', this.ui.mapActions)
    },

    canAssassinateTroop() {
      const waiting = this.game.getWaiting()
      if (!waiting) {
        return false
      }
      const usePowerOption = waiting.selectors[0].choices
        .find(c => c.title === 'Use Power')
      if (!usePowerOption) {
        return false
      }
      return usePowerOption.choices
        .some(c => c === 'Assassinate a Troop' || c.title === 'Assassinate a Troop')
    },

    canReturnSpy() {
      const waiting = this.game.getWaiting()
      if (!waiting) {
        return false
      }
      const usePowerOption = waiting.selectors[0].choices
        .find(c => c.title === 'Use Power')
      if (!usePowerOption) {
        return false
      }
      return usePowerOption.choices
        .some(c => c === 'Return an Enemy Spy' || c.title === 'Return an Enemy Spy')
    },

    clickTroop(troop, loc, event) {
      if (!this.ui.mapActions) {
        return false
      }

      const currentPlayer = this.game.players.current()
      const troopOwner = this.game.players.byOwner(troop)
      if (troopOwner === currentPlayer) {
        return false
      }

      // Top-level action menu: use power to assassinate
      if (this.canAssassinateTroop()) {
        event.stopPropagation()
        const ownerName = troopOwner ? troopOwner.name : 'neutral'
        this.game.respondToInputRequest({
          actor: this.actor.name,
          title: '__ALT_ACTION__',
          selection: [{
            action: 'assassinate-with-power',
            location: loc.name(),
            owner: ownerName,
          }]
        })
        this.$store.dispatch('game/save')
        return true
      }

      // Within-action selection: match against waiting selector choices
      const match = this.matchTroopInSelector(troop, loc)
      if (match) {
        event.stopPropagation()
        this.game.respondToInputRequest(match)
        this.$store.dispatch('game/save')
        return true
      }

      return false
    },

    clickSpy(spy, loc, event) {
      if (!this.ui.mapActions) {
        return false
      }

      const currentPlayer = this.game.players.current()
      const spyOwner = this.game.players.byOwner(spy)
      if (spyOwner === currentPlayer) {
        return false
      }

      // Top-level action menu: use power to return spy
      if (this.canReturnSpy()) {
        event.stopPropagation()
        this.game.respondToInputRequest({
          actor: this.actor.name,
          title: '__ALT_ACTION__',
          selection: [{
            action: 'return-spy-with-power',
            location: loc.name(),
            owner: spyOwner.name,
          }]
        })
        this.$store.dispatch('game/save')
        return true
      }

      // Within-action selection: match against waiting selector choices
      const match = this.matchSpyInSelector(spy, loc)
      if (match) {
        event.stopPropagation()
        this.game.respondToInputRequest(match)
        this.$store.dispatch('game/save')
        return true
      }

      return false
    },

    isUnitSelectable(unit, loc) {
      const owner = this.game.players.byOwner(unit)
      const ownerName = owner ? owner.name : 'neutral'
      return this.ui.selectableUnits.includes(`${loc.name()}, ${ownerName}`)
    },

    // Check if the current waiting selector has a flat choice matching this location name.
    // Also handles "Place a spy" vs "Return spy" choices by inferring the right option
    // based on whether the current player has a spy at the clicked location.
    matchLocationInSelector(loc) {
      const waiting = this.game.getWaiting()
      if (!waiting) {
        return null
      }
      const selector = waiting.selectors[0]
      const locName = loc.name()

      // Direct location name match
      if (selector.choices.some(c => typeof c === 'string' && c === locName)) {
        return {
          actor: this.actor.name,
          title: selector.title,
          selection: [locName],
        }
      }

      // Prefix match: choices like "LocationName, OwnerName" (assassinate/supplant/return targets)
      // Auto-submit only if there's exactly one match at this location
      const prefixMatches = selector.choices.filter(c =>
        typeof c === 'string' && c.startsWith(locName + ', ')
      )
      if (prefixMatches.length === 1) {
        return {
          actor: this.actor.name,
          title: selector.title,
          selection: [prefixMatches[0]],
        }
      }

      // Spy place/return choice: pick the right option based on board state
      const placeSpyChoice = selector.choices.find(c => c === 'Place a spy')
      const returnSpyChoice = selector.choices.find(c =>
        typeof c === 'string' && c.startsWith('Return one of your spies')
      )
      if (placeSpyChoice || returnSpyChoice) {
        const player = this.game.players.current()
        const hasOwnSpy = loc.getSpies(player).length > 0

        if (hasOwnSpy && returnSpyChoice) {
          return {
            actor: this.actor.name,
            title: selector.title,
            selection: [returnSpyChoice],
          }
        }
        else if (!hasOwnSpy && placeSpyChoice) {
          return {
            actor: this.actor.name,
            title: selector.title,
            selection: [placeSpyChoice],
          }
        }
      }

      return null
    },

    // Build a choice string matching the format used by _collectTargets / getAssassinateChoices
    troopChoiceString(troop, loc) {
      const owner = this.game.players.byOwner(troop)
      const ownerName = owner ? owner.name : 'neutral'
      return `${loc.name()}, ${ownerName}`
    },

    // Check if the current waiting selector has a flat or nested choice matching this troop
    matchTroopInSelector(troop, loc) {
      const waiting = this.game.getWaiting()
      if (!waiting) {
        return null
      }
      const selector = waiting.selectors[0]
      const choiceStr = this.troopChoiceString(troop, loc)

      // Flat choices (e.g. aChooseAndAssassinate, aChooseAndSupplant)
      if (selector.choices.some(c => typeof c === 'string' && c === choiceStr)) {
        return {
          actor: this.actor.name,
          title: selector.title,
          selection: [choiceStr],
        }
      }

      // Nested choices with a 'troop' group (e.g. aChooseAndReturn)
      const troopGroup = selector.choices.find(c => c.title === 'troop')
      if (troopGroup && troopGroup.choices.includes(choiceStr)) {
        return {
          actor: this.actor.name,
          title: selector.title,
          selection: [{
            title: 'troop',
            selection: [choiceStr],
          }],
        }
      }

      return null
    },

    // Check if the current waiting selector has a nested choice matching this spy
    matchSpyInSelector(spy, loc) {
      const waiting = this.game.getWaiting()
      if (!waiting) {
        return null
      }
      const selector = waiting.selectors[0]
      const owner = this.game.players.byOwner(spy)
      const choiceStr = `${loc.name()}, ${owner ? owner.name : 'neutral'}`

      // Nested choices with a 'spy' group (e.g. aChooseAndReturn)
      const spyGroup = selector.choices.find(c => c.title === 'spy')
      if (spyGroup && spyGroup.choices.includes(choiceStr)) {
        return {
          actor: this.actor.name,
          title: selector.title,
          selection: [{
            title: 'spy',
            selection: [choiceStr],
          }],
        }
      }

      return null
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

.tyrants :deep(.troop-space) {
  height: 1.2em;
  width: 1.2em;
  border-radius: 50%;
  border: 1px solid black;
  margin: 1px;
}

.tyrants :deep(.troop-space.unit-selected) {
  box-shadow: 0 0 3px 3px #cc99ff;
  cursor: pointer;
}
</style>
