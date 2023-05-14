<template>
  <MagicWrapper :afterLoaded="loadGame">
    <div class="alert alert-warning" v-if="!gameReady">Loading game data</div>

    Cube Draft

    <DebugModal />
  </MagicWrapper>
</template>


<script>
import axios from 'axios'

import { computed } from 'vue'
import { mapState } from 'vuex'

import DebugModal from '@/modules/games/common/components/DebugModal'
import MagicWrapper from '@/modules/magic/components/MagicWrapper'


export default {
  name: 'CubeDraft',

  components: {
    DebugModal,
    MagicWrapper,
  },

  props: {
    data: Object,
    actor: Object,
  },

  computed: {
    ...mapState('magic/cubeDraft', {
      game: 'game',
      gameReady: 'ready',
    }),
  },

  provide() {
    return {
      actor: this.actor,
      do: this.do,
      game: computed(() => this.game),
      save: this.save,
    }
  },

  methods: {
    loadGame() {
      this.$store.dispatch('magic/cubeDraft/loadGame', {
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

      this.game.respondToInputRequest({
        actor: selector.actor,
        title: selector.title,
        selection: [action],
        key: request.key,
      })
    },

    async save() {
      const game = this.game
      const payload = {
        gameId: game._id,
        responses: game.responses,
        chat: game.getChat(),
        waiting: game.waiting,
        gameOver: game.gameOver,
        gameOverData: game.gameOverData,
      }

      const requestResult = await axios.post('/api/game/saveFull', payload)

      if (requestResult.data.status === 'success') {
        console.log('saved')
        this.game.usedUndo = false
      }
      else {
        alert('Save game failed. Try reloading and trying again.\n' + requestResult.data.message)
      }
    },

  },
}
</script>


<style scoped>
</style>
