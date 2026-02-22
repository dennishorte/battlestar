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

          <!-- Custom action UIs -->
          <ActivateSystem v-if="activeActionType === 'activate-system'" />
          <MoveShips v-if="activeActionType === 'move-ships'" :request="waitingRequest" />
          <ProduceUnits v-if="activeActionType === 'produce-units'" :request="waitingRequest" />
          <TradeOffer v-if="activeActionType === 'trade-offer'" />
          <RedistributeTokens v-if="activeActionType === 'redistribute-tokens'" />

          <WaitingPanel />

          <!-- Player Panels -->
          <div class="player-panels">
            <PlayerPanel
              v-for="player in orderedPlayers"
              :key="player.name"
              :player="player"
            />
          </div>
        </div>

        <!-- Map Column (right-most, full height) -->
        <div class="map-column" :style="mapColumnStyle">
          <GalaxyMap @update:width="mapWidth = $event" />
        </div>

      </div>
    </div>

    <SystemDetailModal />
    <DebugModal />
  </div>
</template>


<script>
// Common Components
import GameMenu from '@/modules/games/common/components/GameMenu.vue'
import WaitingPanel from '@/modules/games/common/components/WaitingPanel.vue'
import DebugModal from '@/modules/games/common/components/DebugModal.vue'

// Twilight Components
import GalaxyMap from './GalaxyMap.vue'
import GameLogTwilight from './GameLogTwilight.vue'
import PhaseInfo from './PhaseInfo.vue'
import PlayerPanel from './PlayerPanel.vue'

// Action UIs
import ActivateSystem from './actions/ActivateSystem.vue'
import MoveShips from './actions/MoveShips.vue'
import ProduceUnits from './actions/ProduceUnits.vue'
import RedistributeTokens from './actions/RedistributeTokens.vue'
import TradeOffer from './actions/TradeOffer.vue'

// Modals
import SystemDetailModal from './modals/SystemDetailModal.vue'


export default {
  name: 'TwilightGame',

  components: {
    ActivateSystem,
    DebugModal,
    GalaxyMap,
    GameLogTwilight,
    GameMenu,
    MoveShips,
    PhaseInfo,
    PlayerPanel,
    ProduceUnits,
    RedistributeTokens,
    SystemDetailModal,
    TradeOffer,
    WaitingPanel,
  },

  data() {
    return {
      mapWidth: 0,
      ui: {
        fn: {
          insertSelectorSubtitles: this.insertSelectorSubtitles,
          getActionTypeHandler: this.getActionTypeHandler,
        },
        modals: {
          systemDetail: { systemId: null },
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

    activeActionType() {
      if (!this.waitingRequest) {
        return null
      }
      const title = this.waitingRequest.title?.toLowerCase() || ''

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
      if (title.includes('redistribute') || title.includes('command token')) {
        return 'redistribute-tokens'
      }

      return null
    },
  },

  watch: {
    waitingRequest: {
      immediate: true,
      handler(request) {
        this.updateHighlightedSystems(request)
      },
    },
  },

  methods: {
    insertSelectorSubtitles() {},

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
      const waiting = this.waitingRequest
      if (!waiting) {
        return
      }

      this.game.respondToInputRequest({
        actor: payload.actor || this.actor.name,
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
  },

  beforeUnmount() {
    this.bus.off('system-click', this.handleSystemClick)
    this.bus.off('submit-action', this.handleSubmitAction)
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

.player-panels {
  padding-bottom: 3em;
}

.map-column {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  flex: 0 0 auto;
  overflow: hidden;
  padding: 0;
}

/* Override common component text colors for dark theme */
.twilight :deep(.waiting-panel) {
  background: #f8f9fa;
  color: #333;
}
</style>
