<template>
  <div class="dune">
    <div class="container-fluid">
      <div class="row flex-nowrap main-row">

        <div class="col history-column">
          <GameMenu>
            <DropdownButton @click="openRules">rules</DropdownButton>
          </GameMenu>
          <GameLogDune />
        </div>

        <div class="col game-column">
          <DuneConflict />
          <DuneBoardState />
          <DuneFactionTrack />
          <DuneImperiumRow />
          <DuneContractMarket v-if="game.settings.useCHOAM" />
          <WaitingPanel />
        </div>

        <div class="col player-column">
          <DunePlayerPanel
            v-for="player in orderedPlayers"
            :key="player.name"
            :player="player"
          />
        </div>

        <div class="col spaces-column">
          <DuneActionSpaces />
        </div>

      </div>
    </div>

    <DebugModal />
  </div>
</template>


<script>
import DropdownButton from '@/components/DropdownButton.vue'
import GameMenu from '@/modules/games/common/components/GameMenu.vue'
import WaitingPanel from '@/modules/games/common/components/WaitingPanel.vue'
import DebugModal from '@/modules/games/common/components/DebugModal.vue'

import GameLogDune from './GameLogDune.vue'
import DunePlayerPanel from './DunePlayerPanel.vue'
import DuneImperiumRow from './DuneImperiumRow.vue'
import DuneConflict from './DuneConflict.vue'
import DuneFactionTrack from './DuneFactionTrack.vue'
import DuneBoardState from './DuneBoardState.vue'
import DuneContractMarket from './DuneContractMarket.vue'
import DuneActionSpaces from './DuneActionSpaces.vue'


export default {
  name: 'DuneGame',

  components: {
    DebugModal,
    DropdownButton,
    DuneActionSpaces,
    DuneBoardState,
    DuneConflict,
    DuneContractMarket,
    DuneFactionTrack,
    DuneImperiumRow,
    DunePlayerPanel,
    GameLogDune,
    GameMenu,
    WaitingPanel,
  },

  inject: ['actor', 'bus', 'game'],

  data() {
    return {
      ui: {
        fn: {},
        modals: {},
      },
    }
  },

  provide() {
    return {
      ui: this.ui,
    }
  },

  computed: {
    orderedPlayers() {
      const viewer = this.game.players.byName(this.actor.name)
      return this.game.players.startingWith(viewer)
    },
  },

  methods: {
    openRules() {
      window.open('https://www.direwolfdigital.com/wp-content/uploads/2024/07/Dune-Imperium-Uprising-Rules.pdf')
    },
  },

  mounted() {
    document.title = this.game.settings.name || 'Dune Imperium: Uprising'
  },
}
</script>


<style scoped>
.dune {
  width: 100vw;
  height: calc(100vh - 60px);
  font-size: .8rem;
  overflow: auto;
  color: #2c2416;
  background-color: #f8f5f0;
}

.history-column {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  min-width: 400px;
  max-width: 400px;
  overflow: hidden;
}

.game-column {
  height: calc(100vh - 60px);
  min-width: 280px;
  max-width: 380px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 3em;
}

.player-column {
  height: calc(100vh - 60px);
  min-width: 220px;
  max-width: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 3em;
}

.spaces-column {
  height: calc(100vh - 60px);
  min-width: 200px;
  max-width: 240px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 3em;
}
</style>
