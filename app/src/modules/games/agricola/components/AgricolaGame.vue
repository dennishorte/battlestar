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
import PlayerTableau from './PlayerTableau'
import RoundInfo from './RoundInfo'
import ScoreTable from './ScoreTable'

// Modals
import DebugModal from '@/modules/games/common/components/DebugModal'


export default {
  name: 'AgricolaGame',

  components: {
    ActionsColumn,
    DropdownButton,
    DropdownDivider,
    GameLogAgricola,
    GameMenu,
    ModalBase,
    PlayerTableau,
    RoundInfo,
    ScoreTable,
    WaitingPanel,

    DebugModal,
  },

  data() {
    return {
      ui: {
        fn: {
          insertSelectorSubtitles: this.insertSelectorSubtitles,
        },
        modals: {},
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

  computed: {
    orderedPlayers() {
      const viewingPlayer = this.game.players.byName(this.actor.name)
      return this.game.players.startingWith(viewingPlayer)
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
