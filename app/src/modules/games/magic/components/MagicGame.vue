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

        <DropdownButton @click="matchStatsModalVis = true">
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

  <CardCloseupModal v-if="selectedCardId" />
  <CounterCloseupModal />

  <BModal v-model="matchStatsModalVis" title="Match Stats">
    <MatchStats />
  </BModal>
</template>


<script>
import { mapState } from 'vuex'

import CardCloseupModal from './CardCloseupModal.vue'
import CounterCloseupModal from './CounterCloseupModal.vue'
import DropdownDivider from '@/components/DropdownDivider.vue'
import DropdownButton from '@/components/DropdownButton.vue'
import DropdownRouterLink from '@/components/DropdownRouterLink.vue'
import GameLogMagic from './GameLogMagic.vue'
import GameMenu from '@/modules/games/common/components/GameMenu.vue'
import MatchStats from './MatchStats.vue'
import PhaseSelector from './PhaseSelector.vue'
import PlayerTableau from './PlayerTableau.vue'

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
    MatchStats,
    PhaseSelector,
    PlayerTableau,
  },

  inject: ['game', 'actor'],

  data() {
    return {
      matchStatsModalVis: false,
    }
  },

  computed: {
    ...mapState('magic/game', {
      linkedDraft: 'linkedDraft',
      selectedCardId: 'selectedCardId',
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
