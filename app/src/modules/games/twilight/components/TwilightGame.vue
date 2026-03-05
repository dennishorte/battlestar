<template>
  <div class="twilight">
    <div class="container-fluid">
      <div class="row flex-nowrap main-row">

        <!-- History Column -->
        <div class="col history-column">
          <GameMenu />
          <GameLogTwilight />
        </div>

        <!-- Game Column: Phase Info + Actions -->
        <div class="col game-column center-column">
          <PhaseInfo />
          <CombatDisplay />

          <!-- Custom action UIs -->
          <ActivateSystem v-if="activeActionType === 'activate-system'" :player-name="selectedPlayerName" />
          <MoveShips v-if="activeActionType === 'move-ships'" :request="selectedWaitingRequest" :player-name="selectedPlayerName" />
          <ProduceUnits v-if="activeActionType === 'produce-units'" :request="selectedWaitingRequest" :player-name="selectedPlayerName" />
          <TradeOffer v-if="activeActionType === 'trade-offer'" :player-name="selectedPlayerName" />
          <RedistributeTokens v-if="activeActionType === 'redistribute-tokens'" :request="selectedWaitingRequest" :player-name="selectedPlayerName" />
          <AgendaVote v-if="activeActionType === 'agenda-vote'" :request="selectedWaitingRequest" :player-name="selectedPlayerName" />
          <ResearchTech v-if="activeActionType === 'research-tech'" :request="selectedWaitingRequest" :player-name="selectedPlayerName" />
          <ExhaustPlanets v-if="activeActionType === 'exhaust-planets'" :request="selectedWaitingRequest" :player-name="selectedPlayerName" />

          <div class="toolbar">
            <button class="btn btn-sm btn-outline-secondary" @click="openShipOverview">Units</button>
            <button class="btn btn-sm btn-outline-secondary" @click="openTechTree">Tech</button>
            <button class="btn btn-sm btn-outline-secondary" @click="openRulesReference">Rules</button>
          </div>

          <WaitingPanel />
        </div>

        <!-- Player Column -->
        <div class="col players-column">
          <PlayerPanel
            v-for="player in orderedPlayers"
            :key="player.name"
            :player="player"
          />
        </div>

        <!-- Map Column (right-most, full height) -->
        <div class="map-column" :style="mapColumnStyle">
          <GalaxyMap @update:width="mapWidth = $event" />
        </div>

      </div>
    </div>

    <SystemDetailModal />
    <CardDetailModal />
    <CommandTokensModal />
    <RulesReferenceModal />
    <ShipOverviewModal />
    <TechTreeModal />
    <DebugModal />
  </div>
</template>


<script>
// Common Components
import GameMenu from '@/modules/games/common/components/GameMenu.vue'
import WaitingPanel from '@/modules/games/common/components/WaitingPanel.vue'
import DebugModal from '@/modules/games/common/components/DebugModal.vue'

// Twilight Components
import CombatDisplay from './CombatDisplay.vue'
import GalaxyMap from './GalaxyMap.vue'
import GameLogTwilight from './GameLogTwilight.vue'
import PhaseInfo from './PhaseInfo.vue'
import PlayerPanel from './PlayerPanel.vue'

// Action UIs
import ActivateSystem from './actions/ActivateSystem.vue'
import AgendaVote from './actions/AgendaVote.vue'
import MoveShips from './actions/MoveShips.vue'
import ProduceUnits from './actions/ProduceUnits.vue'
import RedistributeTokens from './actions/RedistributeTokens.vue'
import ExhaustPlanets from './actions/ExhaustPlanets.vue'
import ResearchTech from './actions/ResearchTech.vue'
import TradeOffer from './actions/TradeOffer.vue'

// Modals
import CardDetailModal from './modals/CardDetailModal.vue'
import RulesReferenceModal from './modals/RulesReferenceModal.vue'
import ShipOverviewModal from './modals/ShipOverviewModal.vue'
import SystemDetailModal from './modals/SystemDetailModal.vue'
import CommandTokensModal from './modals/CommandTokensModal.vue'
import TechTreeModal from './modals/TechTreeModal.vue'

// Selector option components
import ActionCardChip from './ActionCardChip.vue'
import AgendaChip from './AgendaChip.vue'
import ObjectiveChip from './ObjectiveChip.vue'
import StrategyCardChip from './StrategyCardChip.vue'
import TechChip from './TechChip.vue'

import { h } from 'vue'
import { twilight } from 'battlestar-common'
const res = twilight.res

// Inline component for action options that include strategy card chips
const ActionWithCards = {
  props: {
    title: String,
    cardIds: Array,
  },
  inject: ['game', 'ui'],
  components: { StrategyCardChip },
  render() {
    return h('div', { style: { display: 'flex', alignItems: 'center', gap: '0.5em', flexWrap: 'wrap' } }, [
      ...this.cardIds.map(id => h(StrategyCardChip, { cardId: id })),
    ])
  },
}


export default {
  name: 'TwilightGame',

  components: {
    ActivateSystem,
    AgendaVote,
    CardDetailModal,
    CombatDisplay,
    CommandTokensModal,
    DebugModal,
    ExhaustPlanets,
    GalaxyMap,
    GameLogTwilight,
    GameMenu,
    MoveShips,
    PhaseInfo,
    PlayerPanel,
    ProduceUnits,
    RedistributeTokens,
    ResearchTech,
    RulesReferenceModal,
    ShipOverviewModal,
    SystemDetailModal,
    TechTreeModal,
    TradeOffer,
    WaitingPanel,
  },

  data() {
    return {
      selectedPlayerName: null,
      mapWidth: 0,
      ui: {
        fn: {
          insertSelectorSubtitles: this.insertSelectorSubtitles,
          getActionTypeHandler: this.getActionTypeHandler,
          selectorOptionComponent: this.selectorOptionComponent,
        },
        modals: {
          systemDetail: { systemId: null },
          cardDetail: { type: null, id: null, context: null },
          rulesReference: { filter: null },
        },
        highlightedSystems: [],
        interactiveSystems: [],
      },
    }
  },

  inject: ['actor', 'bus', 'game'],

  provide() {
    return {
      ui: this.ui,
    }
  },

  computed: {
    mapColumnStyle() {
      if (!this.mapWidth) {
        return {}
      }
      return { width: this.mapWidth + 'px' }
    },

    orderedPlayers() {
      if (!this.game.state.initializationComplete) {
        return []
      }
      const viewingPlayer = this.game.players.byName(this.actor.name)
      return this.game.players.startingWith(viewingPlayer)
    },

    waitingRequest() {
      if (!this.game.state.initializationComplete) {
        return null
      }
      const player = this.game.players.byName(this.actor.name)
      if (!player) {
        return null
      }
      if (!this.game.checkPlayerHasActionWaiting(player)) {
        return null
      }
      return this.game.getWaiting(player)
    },

    selectedWaitingRequest() {
      const name = this.selectedPlayerName || this.actor.name
      const player = this.game.players.byName(name)
      if (!player) {
        return null
      }
      if (!this.game.checkPlayerHasActionWaiting(player)) {
        return null
      }
      return this.game.getWaiting(player)
    },

    activeActionType() {
      const request = this.selectedWaitingRequest
      if (!request) {
        return null
      }
      const title = request.title?.toLowerCase() || ''

      if (title.includes('activate') && title.includes('system')) {
        return 'activate-system'
      }
      if (title.includes('move') && title.includes('ship')) {
        return 'move-ships'
      }
      if (title.includes('produce') || title.includes('production')) {
        return 'produce-units'
      }
      if (title.includes('trade') && title.includes('offer')) {
        return 'trade-offer'
      }
      if (request.allowsAction === 'redistribute-tokens') {
        return 'redistribute-tokens'
      }
      if (title.includes('exhaust planets for') && !title.includes('votes')) {
        return 'exhaust-planets'
      }
      if (title.includes('vote on') || title.includes('exhaust planets for votes') || title.includes('spend trade goods for extra votes')) {
        return 'agenda-vote'
      }
      if (title === 'research technology' || title.includes('research technology')) {
        return 'research-tech'
      }

      return null
    },
  },

  watch: {
    waitingRequest: {
      immediate: true,
      handler(request) {
        this.updateHighlightedSystems(request)
        if (request) {
          this.selectedPlayerName = this.actor.name
        }
      },
    },
  },

  methods: {
    onWaitingPlayerSelected(name) {
      this.selectedPlayerName = name
    },

    insertSelectorSubtitles() {},

    selectorOptionComponent(option) {
      const name = option.title || option
      if (typeof name !== 'string') {
        return undefined
      }

      // Action type with embedded strategy card chips
      if (option.strategyCardIds?.length > 0) {
        return {
          component: ActionWithCards,
          props: { title: name, cardIds: option.strategyCardIds },
        }
      }

      // Strategy cards (raw IDs like 'leadership', 'trade')
      const strategyCard = res.getStrategyCard(name)
      if (strategyCard) {
        return {
          component: StrategyCardChip,
          props: { cardId: name },
        }
      }

      // Action cards (by ID like 'sabotage' or by name like 'Sabotage')
      const actionCard = res.getActionCard(name) || res.getActionCardByName(name)
      if (actionCard) {
        return {
          component: ActionCardChip,
          props: { cardId: actionCard.id },
        }
      }

      // Technology IDs (e.g., 'antimass-deflectors', 'carrier-2')
      const tech = res.getTechnology(name)
      if (tech) {
        return {
          component: TechChip,
          props: { techId: name },
        }
      }

      // Detect "id: Name" pattern used for objectives and agenda cards
      const colonIdx = name.indexOf(': ')
      if (colonIdx > 0) {
        const id = name.substring(0, colonIdx)
        const obj = res.getObjective(id)
        if (obj) {
          return {
            component: ObjectiveChip,
            props: { objectiveId: id },
          }
        }
        const agenda = res.getAgendaCard(id)
        if (agenda) {
          return {
            component: AgendaChip,
            props: { agendaId: id },
          }
        }
      }

      return undefined
    },

    getActionTypeHandler(request) {
      // Route custom action types to their dedicated UIs
      const title = request.title?.toLowerCase() || ''

      if (title.includes('activate') && title.includes('system')) {
        return {
          message: 'Activate a system by clicking it on the map.',
          buttonLabel: null,
          handler: null,
        }
      }

      return null
    },

    updateHighlightedSystems(request) {
      if (!request) {
        this.ui.highlightedSystems = []
        this.ui.interactiveSystems = []
        return
      }

      // If choices are system IDs, highlight them on the map
      const choices = request.choices || []
      const systemIds = []

      for (const choice of choices) {
        const id = typeof choice === 'string' ? choice : choice.title
        if (id && this.game.state.systems[id]) {
          systemIds.push(id)
        }
      }

      this.ui.highlightedSystems = systemIds
      this.ui.interactiveSystems = systemIds
    },

    openShipOverview() {
      this.$modal('twilight-ship-overview').show()
    },

    openTechTree() {
      this.$modal('twilight-tech-tree').show()
    },

    openRulesReference(filter) {
      if (typeof filter === 'string') {
        this.ui.modals.rulesReference.filter = filter
      }
      this.$modal('twilight-rules-reference').show()
    },

    openSystemDetail(systemId) {
      this.ui.modals.systemDetail.systemId = systemId
      this.$modal('twilight-system-detail').show()
    },

    handleSystemClick({ systemId }) {
      // If in an active action mode, let the action component handle it
      if (this.activeActionType) {
        return
      }

      // If choices contain this system ID, submit it
      if (this.waitingRequest) {
        const choices = this.waitingRequest.choices || []
        const match = choices.find(c => {
          const id = typeof c === 'string' ? c : c.title
          return id === systemId || id === String(systemId)
        })

        if (match) {
          this.game.respondToInputRequest({
            actor: this.actor.name,
            title: this.waitingRequest.title,
            selection: [typeof match === 'string' ? match : match.title],
          })
          this.$store.dispatch('game/save')
          return
        }
      }

      // Default: open system detail modal
      this.openSystemDetail(systemId)
    },

    handleSubmitAction(payload) {
      const actorName = payload.actor || this.selectedPlayerName || this.actor.name
      const player = this.game.players.byName(actorName)
      const waiting = player ? this.game.getWaiting(player) : null
      if (!waiting) {
        return
      }

      this.game.respondToInputRequest({
        actor: actorName,
        title: waiting.title,
        selection: payload.selection,
      })
      this.$store.dispatch('game/save')
    },
  },

  mounted() {
    document.title = this.game.settings.name || 'Twilight Imperium'
    this.bus.on('system-click', this.handleSystemClick)
    this.bus.on('submit-action', this.handleSubmitAction)
    this.bus.on('waiting-player-selected', this.onWaitingPlayerSelected)
  },

  beforeUnmount() {
    this.bus.off('system-click', this.handleSystemClick)
    this.bus.off('submit-action', this.handleSubmitAction)
    this.bus.off('waiting-player-selected', this.onWaitingPlayerSelected)
  },
}
</script>


<style scoped>
.twilight {
  width: 100vw;
  height: calc(100vh - 60px);
  font-size: .8rem;
  overflow-x: auto;
  overflow-y: hidden;
  background: #1a1a2e;
  color: #e0e0e0;
}

.main-row {
  height: 100%;
}

.history-column {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  min-width: 300px;
  max-width: 350px;
  overflow: hidden;
  background: #f8f9fa;
  color: #333;
}

.center-column {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  min-width: 280px;
  max-width: 360px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  background: #f8f9fa;
  color: #333;
}

.players-column {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  min-width: 220px;
  max-width: 280px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  background: #f8f9fa;
  color: #333;
}

.map-column {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  flex: 0 0 auto;
  overflow: hidden;
  padding: 0;
}

.toolbar {
  padding: .25em .5em;
  border-bottom: 1px solid #dee2e6;
}

/* Override common component styles */
.twilight :deep(.waiting-panel) {
  background: #f8f9fa;
  color: #333;
}

.twilight :deep(.waiting-panel .tab-content .active) {
  margin-left: 0;
  margin-right: 0;
}
</style>
