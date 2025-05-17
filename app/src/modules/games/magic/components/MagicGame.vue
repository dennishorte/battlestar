<template>
  <div class="magic-game" @click="unselectCard">

    <div class="magic-column log-column">
      <GameMenu>
        <DropdownDivider />

        <DropdownButton
          v-if="!linkedDraft"
          data-bs-toggle="modal"
          data-bs-target="#link-to-draft-modal"
        >
          link to draft
        </DropdownButton>

        <DropdownRouterLink
          v-if="!!linkedDraft"
          :to="'/magic/cube/' + linkedDraft.settings.cubeId"
        >
          cube
        </DropdownRouterLink>

        <DropdownButton
          data-bs-toggle="modal"
          data-bs-target="#match-stats-modal"
        >
          match stats
        </DropdownButton>

      </GameMenu>

      <GameLogMagic />
    </div>

    <div class="magic-column phase-selector-column">
      <PhaseSelector />
    </div>

    <div
      v-for="player in orderedPlayers"
      :key="player.name"
      class="magic-column"
    >
      <PlayerTableau :player="player" />
    </div>
  </div>

  <CardCloseupModal />
  <CounterCloseupModal />
</template>


<script>
import { mapState } from 'vuex'

import CardCloseupModal from './CardCloseupModal'
import CounterCloseupModal from './CounterCloseupModal'
import DropdownDivider from '@/components/DropdownDivider'
import DropdownButton from '@/components/DropdownButton'
import DropdownRouterLink from '@/components/DropdownRouterLink'
import GameLogMagic from './GameLogMagic'
import GameMenu from '@/modules/games/common/components/GameMenu'
import PhaseSelector from './PhaseSelector'
import PlayerTableau from './PlayerTableau'

export default {
  name: 'MagicGame',

  components: {
    CardCloseupModal,
    CounterCloseupModal,
    DropdownDivider,
    DropdownButton,
    DropdownRouterLink,
    GameLogMagic,
    GameMenu,
    PhaseSelector,
    PlayerTableau,
  },

  inject: ['game', 'actor'],

  computed: {
    ...mapState('magic/game', {
      linkedDraft: 'linkedDraft',
    }),

    orderedPlayers() {
      const player = this.game.players.byName(this.actor.name)
      return this.game.players.startingWith(player)
    },
  },

  methods: {
    unselectCard() {
      this.$store.dispatch('magic/game/unselectCard')
      this.$store.commit('magic/game/cancelChooseTarget')
    },
  },
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
