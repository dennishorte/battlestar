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
  },

  provide() {
    return {
      actor: this.actor,
      game: computed(() => this.game),
      save: this.save,
    }
  },

  methods: {
    loadGame() {
      this.$store.dispatch('magic/game/loadGame', this.data)
    },

    async save() {
      const game = this.game
      const payload = {
        gameId: game._id,
        responses: game.responses,
        chat: game.getChat(),
      }
      const requestResult = await axios.post('/api/game/saveFull', payload)

      if (requestResult.data.status === 'success') {
        this.game.usedUndo = false
      }
      else {
        alert('Save game failed. Try reloading and trying again.\n' + requestResult.data.message)
      }
    },
  },
}
</script>
