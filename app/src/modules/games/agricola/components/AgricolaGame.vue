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
    </ModalBase>

    <CardViewerModal />
    <ScoreBreakdownModal />
    <DebugModal />
  </div>
</template>


<script>
// Common Components
import DropdownButton from '@/components/DropdownButton'
import DropdownDivider from '@/components/DropdownDivider'
import GameMenu from '@/modules/games/common/components/GameMenu'
import WaitingPanel from '@/modules/games/common/components/WaitingPanel'
import ModalBase from '@/components/ModalBase'

// Agricola Components
import ActionsColumn from './ActionsColumn'
import GameLogAgricola from './GameLogAgricola'
import MajorImprovements from './MajorImprovements'
import PlayerTableau from './PlayerTableau'
import RoundInfo from './RoundInfo'
import ScoreTable from './ScoreTable'

// Modals
import CardViewerModal from './CardViewerModal'
import ScoreBreakdownModal from './ScoreBreakdownModal'
import DebugModal from '@/modules/games/common/components/DebugModal'

// Utilities
import { agricola } from 'battlestar-common'
const { fenceUtil } = agricola


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

    CardViewerModal,
    ScoreBreakdownModal,
    DebugModal,
  },

  data() {
    return {
      ui: {
        fn: {
          insertSelectorSubtitles: this.insertSelectorSubtitles,
          showCard: this.showCard,
          showScoreBreakdown: this.showScoreBreakdown,
        },
        modals: {
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
        },
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
          return
        }

        // Check if this is a fencing action by looking at the title or choices
        const title = request.title || ''
        const isFencing = title.includes('pasture') || title.includes('spaces selected') ||
          request.choices.some(c => {
            const text = c.title || c
            return text.startsWith('Space (') || text.startsWith('Deselect (')
          })

        if (!isFencing) {
          this.clearFencingState()
          return
        }

        // Fencing is active - sync state from backend choices
        this.ui.fencing.active = true
        this.syncFencingStateFromChoices(request)
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

    showCard(cardId, cardType) {
      this.ui.modals.cardViewer.cardId = cardId
      this.ui.modals.cardViewer.cardType = cardType || 'unknown'
      this.$modal('agricola-card-viewer').show()
    },

    showScoreBreakdown(playerName) {
      this.ui.modals.scoreBreakdown.playerName = playerName
      this.$modal('agricola-score-breakdown').show()
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
    },

    syncFencingStateFromChoices(request) {
      // Sync our local selection with the choices from the backend
      // Selected spaces are indicated by "Deselect (row,col)" choices
      if (!request || !request.choices) {
        return
      }

      const selectedFromChoices = []
      const deselectPattern = /Deselect \((\d+),(\d+)\)/

      for (const choice of request.choices) {
        const choiceText = choice.title || choice
        const match = choiceText.match(deselectPattern)
        if (match) {
          selectedFromChoices.push({
            row: parseInt(match[1]),
            col: parseInt(match[2]),
          })
        }
      }

      this.ui.fencing.selectedSpaces = selectedFromChoices
    },
  },

  mounted() {
    document.title = this.game.settings.name || 'Agricola'
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
  min-width: 300px;
  max-width: 400px;
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
