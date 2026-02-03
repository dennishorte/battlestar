<template>
  <div class="agricola">
    <div class="container-fluid">
      <div class="row flex-nowrap main-row">
        <!-- History Column -->
        <div class="col history-column">
          <GameMenu>
            <DropdownButton @click="openRules">rules</DropdownButton>
            <DropdownDivider />
            <DropdownButton @click="showScores">scores</DropdownButton>
          </GameMenu>

          <GameLogAgricola />
        </div>

        <!-- Actions Column -->
        <div class="col game-column actions-column">
          <RoundInfo />
          <ActionsColumn />
          <MajorImprovements />
          <WaitingPanel />
        </div>

        <!-- Player Tableaus -->
        <div v-for="player in orderedPlayers" :key="player.name" class="col game-column">
          <PlayerTableau :player="player" />
        </div>

      </div>
    </div>

    <ModalBase id="agricola-scores">
      <template #header>Score Overview</template>
      <ScoreTable />
      <template #footer>
        <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </template>
    </ModalBase>

    <GameOverviewModal />
    <ActionSpaceModal />
    <CardViewerModal />
    <ScoreBreakdownModal />
    <DebugModal />

    <!-- Crop Picker for Sowing -->
    <div v-if="cropPicker.active" class="crop-picker-overlay" @click.self="closeCropPicker">
      <div class="crop-picker">
        <div class="crop-picker-title">Choose crop to sow</div>
        <div class="crop-picker-options">
          <button class="crop-option grain" @click="selectCrop('grain')">
            <span class="crop-icon">🌾</span>
            <span class="crop-label">Grain</span>
          </button>
          <button class="crop-option vegetables" @click="selectCrop('vegetables')">
            <span class="crop-icon">🥕</span>
            <span class="crop-label">Vegetables</span>
          </button>
        </div>
        <button class="crop-picker-cancel" @click="closeCropPicker">Cancel</button>
      </div>
    </div>
  </div>
</template>


<script>
// Common Components
import DropdownButton from '@/components/DropdownButton.vue'
import DropdownDivider from '@/components/DropdownDivider.vue'
import GameMenu from '@/modules/games/common/components/GameMenu.vue'
import WaitingPanel from '@/modules/games/common/components/WaitingPanel.vue'
import ModalBase from '@/components/ModalBase.vue'

// Agricola Components
import ActionsColumn from './ActionsColumn.vue'
import AgricolaCardChip from './AgricolaCardChip.vue'
import GameLogAgricola from './GameLogAgricola.vue'
import MajorImprovements from './MajorImprovements.vue'
import PlayerTableau from './PlayerTableau.vue'
import RoundInfo from './RoundInfo.vue'
import ScoreTable from './ScoreTable.vue'

// Modals
import ActionSpaceModal from './ActionSpaceModal.vue'
import CardViewerModal from './CardViewerModal.vue'
import GameOverviewModal from './GameOverviewModal.vue'
import ScoreBreakdownModal from './ScoreBreakdownModal.vue'
import DebugModal from '@/modules/games/common/components/DebugModal.vue'

// Utilities
import { agricola } from 'battlestar-common'
const { fenceUtil, res } = agricola


export default {
  name: 'AgricolaGame',

  components: {
    ActionsColumn,
    DropdownButton,
    DropdownDivider,
    GameLogAgricola,
    GameMenu,
    MajorImprovements,
    ModalBase,
    PlayerTableau,
    RoundInfo,
    ScoreTable,
    WaitingPanel,

    ActionSpaceModal,
    CardViewerModal,
    GameOverviewModal,
    ScoreBreakdownModal,
    DebugModal,
  },

  data() {
    return {
      ui: {
        fn: {
          insertSelectorSubtitles: this.insertSelectorSubtitles,
          showActionSpace: this.showActionSpace,
          showCard: this.showCard,
          showGameOverview: this.showGameOverview,
          showScoreBreakdown: this.showScoreBreakdown,
          selectorOptionComponent: this.selectorOptionComponent,
          confirmFencing: this.confirmFencing,
          cancelFencing: this.cancelFencing,
        },
        modals: {
          actionSpace: {
            actionId: '',
          },
          cardViewer: {
            cardId: '',
            cardType: '',
          },
          scoreBreakdown: {
            playerName: '',
          },
        },
        // Fencing UI state
        fencing: {
          active: false,
          selectedSpaces: [],
          fenceEdges: {},
          validation: null,
          fenceableSpaces: [],
        },
        // Plowing UI state
        plowing: {
          active: false,
          validSpaces: [],
        },
        // Room building UI state
        buildingRoom: {
          active: false,
          validSpaces: [],
        },
        // Stable building UI state
        buildingStable: {
          active: false,
          validSpaces: [],
        },
        // Sowing UI state
        sowing: {
          active: false,
          validSpaces: [],
          canSowGrain: false,
          canSowVeg: false,
        },
      },
      // Crop picker state
      cropPicker: {
        active: false,
        row: null,
        col: null,
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
    orderedPlayers() {
      const viewingPlayer = this.game.players.byName(this.actor.name)
      return this.game.players.startingWith(viewingPlayer)
    },

    // Get the current waiting request for the viewing player
    waitingRequest() {
      const viewingPlayer = this.game.players.byName(this.actor.name)
      if (!viewingPlayer) {
        return null
      }
      return this.game.getWaiting(viewingPlayer)
    },

    // Check if we're in a fencing action
    isFencingAction() {
      if (!this.waitingRequest) {
        return false
      }
      // Check if choices contain fencing-related options
      const title = this.waitingRequest.title || ''
      return title.includes('pasture') || title.includes('spaces selected')
    },

    // Get current player for validation
    currentPlayer() {
      return this.game.players.byName(this.actor.name)
    },
  },

  watch: {
    // Watch for changes to waiting request
    waitingRequest: {
      immediate: true,
      handler(request) {
        if (!request || !request.choices) {
          this.clearFencingState()
          this.clearPlowingState()
          this.clearBuildingRoomState()
          this.clearBuildingStableState()
          this.clearSowingState()
          return
        }

        // Check if this is a plowing action
        if (request.allowsAction === 'plow-space') {
          this.ui.plowing.active = true
          this.ui.plowing.validSpaces = request.validSpaces || []
          this.clearFencingState()
          this.clearBuildingRoomState()
          this.clearSowingState()
          return
        }
        else {
          this.clearPlowingState()
        }

        // Check if this is a room building action
        if (request.allowsAction === 'build-room') {
          this.ui.buildingRoom.active = true
          this.ui.buildingRoom.validSpaces = request.validSpaces || []
          this.clearFencingState()
          this.clearBuildingStableState()
          this.clearSowingState()
          return
        }
        else {
          this.clearBuildingRoomState()
        }

        // Check if this is a stable building action
        if (request.allowsAction === 'build-stable') {
          this.ui.buildingStable.active = true
          this.ui.buildingStable.validSpaces = request.validSpaces || []
          this.clearFencingState()
          this.clearSowingState()
          return
        }
        else {
          this.clearBuildingStableState()
        }

        // Check if this is a sowing action
        if (request.allowsAction === 'sow-field') {
          this.ui.sowing.active = true
          this.ui.sowing.validSpaces = request.validSpaces || []
          this.ui.sowing.canSowGrain = request.canSowGrain || false
          this.ui.sowing.canSowVeg = request.canSowVeg || false
          this.clearFencingState()
          return
        }
        else {
          this.clearSowingState()
        }

        // Check if this is a fencing action
        if (request.allowsAction === 'build-pasture') {
          this.ui.fencing.active = true
          this.ui.fencing.fenceableSpaces = request.fenceableSpaces || []
          // Don't clear selectedSpaces - keep local state
          return
        }
        else {
          this.clearFencingState()
        }
      },
    },

    // Watch selected spaces to update validation
    'ui.fencing.selectedSpaces': {
      deep: true,
      handler() {
        this.updateFenceValidation()
      },
    },
  },

  methods: {
    // Subtitles are now provided by the game engine directly
    insertSelectorSubtitles: function() {},

    openRules() {
      window.open("https://lookout-spiele.de/upload/en_agricola2016.html_Rules_Agricola_EN_2016.pdf")
    },

    showScores() {
      this.$modal('agricola-scores').show()
    },

    showGameOverview() {
      this.$modal('agricola-game-overview').show()
    },

    showActionSpace(actionId) {
      this.ui.modals.actionSpace.actionId = actionId
      this.$modal('agricola-action-space').show()
    },

    showCard(cardId, cardType) {
      this.ui.modals.cardViewer.cardId = cardId
      this.ui.modals.cardViewer.cardType = cardType || 'unknown'
      this.$modal('agricola-card-viewer').show()
    },

    showScoreBreakdown(playerName) {
      this.ui.modals.scoreBreakdown.playerName = playerName
      this.$modal('agricola-score-breakdown').show()
    },

    // Custom option component for cards in selectors
    selectorOptionComponent(option) {
      const name = option.title ? option.title : option

      // Check if this is a card ID (occupation or minor improvement)
      let card = res.getCardById(name)
      if (card) {
        return {
          component: AgricolaCardChip,
          props: {
            cardId: card.id,
            cardType: card.type,
          },
        }
      }

      // Check if this is a card by name (e.g., "Shepherd" instead of "shepherd")
      card = res.getCardByName(name)
      if (card) {
        return {
          component: AgricolaCardChip,
          props: {
            cardId: card.id,
            cardType: card.type,
          },
        }
      }

      // Check if this is a major improvement by ID
      let majorImp = res.getMajorImprovementById(name)
      if (majorImp) {
        return {
          component: AgricolaCardChip,
          props: {
            cardId: majorImp.id,
            cardType: 'major',
          },
        }
      }

      // Check if this is a major improvement by name
      majorImp = res.getMajorImprovementByName(name)
      if (majorImp) {
        return {
          component: AgricolaCardChip,
          props: {
            cardId: majorImp.id,
            cardType: 'major',
          },
        }
      }

      // Check if it's in the format "Name (id)" - used for major improvements
      const match = name.match(/^(.+?)\s*\(([^)]+)\)$/)
      if (match) {
        const impId = match[2]
        majorImp = res.getMajorImprovementById(impId)
        if (majorImp) {
          return {
            component: AgricolaCardChip,
            props: {
              cardId: majorImp.id,
              cardType: 'major',
            },
          }
        }
      }

      // Not a card - use default rendering
      return undefined
    },

    // Fencing methods
    updateFenceValidation() {
      const spaces = this.ui.fencing.selectedSpaces
      const player = this.currentPlayer

      if (!spaces || spaces.length === 0 || !player) {
        this.ui.fencing.fenceEdges = {}
        this.ui.fencing.validation = null
        return
      }

      // Get validation params from player
      const params = {
        wood: player.wood,
        currentFenceCount: player.getFenceCount(),
        maxFences: agricola.res.constants.maxFences,
        existingFences: player.farmyard?.fences || [],
        isSpaceValid: (row, col) => {
          const space = player.getSpace(row, col)
          return space && space.type !== 'room' && space.type !== 'field'
        },
      }

      const validation = fenceUtil.validatePastureSelection(spaces, params)
      this.ui.fencing.validation = validation
      this.ui.fencing.fenceEdges = validation.fenceEdges || {}
    },

    clearFencingState() {
      this.ui.fencing.active = false
      this.ui.fencing.selectedSpaces = []
      this.ui.fencing.fenceEdges = {}
      this.ui.fencing.validation = null
      this.ui.fencing.fenceableSpaces = []
    },

    clearPlowingState() {
      this.ui.plowing.active = false
      this.ui.plowing.validSpaces = []
    },

    clearBuildingRoomState() {
      this.ui.buildingRoom.active = false
      this.ui.buildingRoom.validSpaces = []
    },

    clearBuildingStableState() {
      this.ui.buildingStable.active = false
      this.ui.buildingStable.validSpaces = []
    },

    clearSowingState() {
      this.ui.sowing.active = false
      this.ui.sowing.validSpaces = []
      this.ui.sowing.canSowGrain = false
      this.ui.sowing.canSowVeg = false
    },

    toggleFenceSpace({ row, col }) {
      // Check if space is already selected
      const idx = this.ui.fencing.selectedSpaces.findIndex(
        s => s.row === row && s.col === col
      )

      if (idx >= 0) {
        // Deselect
        this.ui.fencing.selectedSpaces.splice(idx, 1)
      }
      else {
        // Select - check if it's a valid fenceable space
        const isFenceable = this.ui.fencing.fenceableSpaces.some(
          s => s.row === row && s.col === col
        )
        if (isFenceable) {
          this.ui.fencing.selectedSpaces.push({ row, col })
        }
      }
    },

    confirmFencing() {
      const spaces = this.ui.fencing.selectedSpaces
      const validation = this.ui.fencing.validation

      if (!validation || !validation.valid) {
        return
      }

      // Submit the pasture selection
      this.bus.emit('submit-action', {
        actor: this.actor.name,
        action: 'build-pasture',
        spaces: [...spaces],
      })

      // Clear selection after submitting
      this.ui.fencing.selectedSpaces = []
    },

    cancelFencing() {
      // Submit empty selection to cancel
      this.bus.emit('submit-action', {
        actor: this.actor.name,
        action: 'build-pasture',
        spaces: [],
      })

      this.ui.fencing.selectedSpaces = []
    },

    showCropPicker(payload) {
      this.cropPicker.active = true
      this.cropPicker.row = payload.row
      this.cropPicker.col = payload.col
    },

    closeCropPicker() {
      this.cropPicker.active = false
      this.cropPicker.row = null
      this.cropPicker.col = null
    },

    selectCrop(cropType) {
      // Submit the sow action with the selected crop
      this.bus.emit('submit-action', {
        actor: this.actor.name,
        action: 'sow-field',
        row: this.cropPicker.row,
        col: this.cropPicker.col,
        cropType: cropType,
      })
      this.closeCropPicker()
    },

    async handleSubmitAction(actionPayload) {
      // Verify the action is for the current waiting request
      const waiting = this.waitingRequest
      if (!waiting) {
        console.warn('No waiting request for action:', actionPayload)
        return
      }

      // Verify the action matches what's expected
      if (waiting.allowsAction && waiting.allowsAction !== actionPayload.action) {
        console.warn('Action type mismatch:', actionPayload.action, 'expected:', waiting.allowsAction)
        return
      }

      // Build the response payload
      const response = {
        actor: actionPayload.actor,
        title: waiting.title,
        selection: actionPayload,
      }

      try {
        // Submit the action to the game
        this.game.respondToInputRequest(response)
        // Save to the server
        await this.$store.dispatch('game/save')
      }
      catch (e) {
        console.error('Error submitting action:', e)
        alert('Error: ' + e.message)
      }
    },
  },

  mounted() {
    document.title = this.game.settings.name || 'Agricola'

    // Listen for action submissions from the farm board
    this.bus.on('submit-action', this.handleSubmitAction)
    // Listen for crop picker requests
    this.bus.on('show-crop-picker', this.showCropPicker)
    // Listen for fence space toggles
    this.bus.on('toggle-fence-space', this.toggleFenceSpace)
  },

  beforeUnmount() {
    this.bus.off('submit-action', this.handleSubmitAction)
    this.bus.off('show-crop-picker', this.showCropPicker)
    this.bus.off('toggle-fence-space', this.toggleFenceSpace)
  },
}
</script>


<style scoped>
.agricola {
  width: 100vw;
  height: calc(100vh - 60px);
  font-size: .8rem;
  overflow: auto;
}

.game-column {
  height: calc(100vh - 60px);
  min-width: 280px;
  max-width: 350px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 3em;
}

.actions-column {
  min-width: 280px;
  max-width: 340px;
}

.history-column {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  min-width: 400px;
  max-width: 400px;
  overflow: hidden;
}

/* Crop Picker Overlay */
.crop-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.crop-picker {
  background-color: white;
  border-radius: 8px;
  padding: 1.5em;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.crop-picker-title {
  font-size: 1.1em;
  font-weight: 600;
  margin-bottom: 1em;
  color: #333;
}

.crop-picker-options {
  display: flex;
  gap: 1em;
  margin-bottom: 1em;
}

.crop-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em 1.5em;
  border: 2px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: all 0.15s ease;
}

.crop-option:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.crop-option.grain {
  border-color: #daa520;
}

.crop-option.grain:hover {
  background-color: #fff8dc;
  border-color: #b8860b;
}

.crop-option.vegetables {
  border-color: #228b22;
}

.crop-option.vegetables:hover {
  background-color: #f0fff0;
  border-color: #006400;
}

.crop-icon {
  font-size: 2em;
  margin-bottom: 0.25em;
}

.crop-label {
  font-weight: 500;
  color: #555;
}

.crop-picker-cancel {
  padding: 0.5em 1.5em;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f5f5f5;
  cursor: pointer;
  color: #666;
}

.crop-picker-cancel:hover {
  background-color: #e5e5e5;
}
</style>
