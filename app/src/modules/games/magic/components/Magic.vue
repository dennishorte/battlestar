<template>
  <MagicWrapper :afterLoaded="loadGame">
    <div class="alert alert-warning" v-if="!gameReady">Loading game data</div>
    <PreGame v-else-if="inPreGame" />
    <MagicGame v-else />
  </MagicWrapper>
</template>


<script>
import axios from 'axios'
import { computed } from 'vue'
import { mag } from 'battlestar-common'
import { mapState } from 'vuex'

import MagicGame from './MagicGame'
import MagicWrapper from '@/modules/magic/components/MagicWrapper'
import PreGame from './PreGame'


export default {
  name: 'Magic',

  components: {
    MagicGame,
    MagicWrapper,
    PreGame,
  },

  props: {
    data: Object,
    actor: Object,
  },

  computed: {
    ...mapState('magic/cards', {
      cardLookup: 'lookup',
    }),

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
      this.$store.dispatch('magic/game/loadGame', {
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
