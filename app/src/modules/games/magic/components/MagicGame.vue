<template>
  <div class="magic-game">

    <div class="magic-column log-column">
      <GameMenu />

      <GameLog />
      <ChatInput />
    </div>

    <div class="magic-column phase-selector-column">
      <PhaseSelector />
    </div>

    <div
      v-for="player in orderedPlayers"
      class="magic-column"
    >
      <PlayerTableau :player="player" />
    </div>


    <CardCloseupModal />
  </div>
</template>


<script>
import { mapState } from 'vuex'

import CardCloseupModal from './CardCloseupModal'
import ChatInput from '@/modules/games/common/components/ChatInput'
import GameLog from './log/GameLog'
import GameMenu from '@/modules/games/common/components/GameMenu'
import PhaseSelector from './PhaseSelector'
import PlayerTableau from './PlayerTableau'

export default {
  name: 'MagicGame',

  components: {
    CardCloseupModal,
    ChatInput,
    GameLog,
    GameMenu,
    PhaseSelector,
    PlayerTableau,
  },

  inject: ['game', 'actor', 'save'],

  computed: {
    orderedPlayers() {
      const player = this.game.getPlayerByName(this.actor.name)
      return this.game.getPlayersStarting(player)
    },
  }
}
</script>

<style>
:root {
  --not-as-light: #eeeff0;
}
</style>

<style scoped>
.magic-game {
  display: flex;
  flex-direction: row;
}

.magic-column:not(:first-of-type) {
  margin-left: .5em;
}

.log-column {
  display: flex;
  flex-direction: column;
  height: 100vh;
  min-width: 400px;
  max-width: 400px;
  overflow: hidden;
}

.phase-selector-column {
}
</style>
