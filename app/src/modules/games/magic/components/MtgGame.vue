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
import { mapState } from 'vuex'

import DebugModal from '@/modules/games/common/components/DebugModal'
import LinkToDraftModal from './LinkToDraftModal'
import MagicGame from './MagicGame'
import MagicWrapper from '@/modules/magic/components/MagicWrapper'
import MatchStatsModal from './MatchStatsModal'
import PreGame from './PreGame'

import UICardWrapper from '@/modules/magic/util/card.wrapper'


export default {
  name: 'MtgGame',

  components: {
    DebugModal,
    LinkToDraftModal,
    MagicGame,
    MagicWrapper,
    MatchStatsModal,
    PreGame,
  },

  inject: ['actor', 'game'],

  provide() {
    return {
      do: this.do,
    }
  },

  computed: {
    ...mapState('magic/game', {
      gameReady: 'ready',
    }),

    inPreGame() {
      return this.gameReady && !this.game.getDecksSelected()
    },

    player() {
      return this.game ? this.game.players.byName(this.actor.name) : null
    },
  },

  methods: {
    async loadGame() {
      this.game.setCardWrapper(UICardWrapper)
      await this.$store.dispatch('magic/game/loadGame', {
        game: this.game,
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
