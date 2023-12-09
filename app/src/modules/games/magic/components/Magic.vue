<template>
  <MagicWrapper :afterLoaded="loadGame">
    <div class="alert alert-warning" v-if="!gameReady">Loading game data</div>
    <PreGame v-else-if="inPreGame" />
    <MagicGame v-else />

    <DebugModal />
    <LinkToDraftModal />
    <MatchStatsModal />
  </MagicWrapper>
</template>


<script>
import { computed } from 'vue'
import { mag } from 'battlestar-common'
import { mapState } from 'vuex'

import DebugModal from '@/modules/games/common/components/DebugModal'
import LinkToDraftModal from './LinkToDraftModal'
import MagicGame from './MagicGame'
import MagicWrapper from '@/modules/magic/components/MagicWrapper'
import MatchStatsModal from './MatchStatsModal'
import PreGame from './PreGame'


export default {
  name: 'Magic',

  components: {
    DebugModal,
    LinkToDraftModal,
    MagicGame,
    MagicWrapper,
    MatchStatsModal,
    PreGame,
  },

  props: {
    data: Object,
  },

  inject: ['actor', 'save'],

  provide() {
    return {
      do: this.do,
      game: computed(() => this.game),
    }
  },

  computed: {
    ...mapState('magic/game', {
      game: 'game',
      gameReady: 'ready',
    }),

    inPreGame() {
      return !this.game.getDecksSelected()
    },

    player() {
      return this.game ? this.game.getPlayerByName(this.actor.name) : null
    },
  },

  methods: {
    async loadGame() {
      await this.$store.dispatch('magic/game/loadGame', {
        gameData: this.data,
        doFunc: this.do,
      })
    },

    do(player, action) {
      const request = this.game.getWaiting()
      const selector = request.selectors[0]

      if (player) {
        action.playerName = player.name
      }

      try {
        this.game.respondToInputRequest({
          actor: selector.actor,
          title: selector.title,
          selection: [action],
        })
      }
      catch (e) {
        console.log(e)
        alert('error: see console')
      }
    },
  },
}
</script>
