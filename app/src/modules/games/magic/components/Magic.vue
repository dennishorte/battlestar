<template>
  <MagicWrapper :afterLoaded="prepGame">
    <PreGame v-if="inPreGame" />

    <div v-else class="magic-game">
      Magic
    </div>
  </MagicWrapper>
</template>


<script>
import axios from 'axios'
import { computed } from 'vue'
import { mag } from 'battlestar-common'
import { mapState } from 'vuex'

import MagicWrapper from '@/modules/magic/components/MagicWrapper'
import PreGame from './PreGame'


export default {
  name: 'Magic',

  components: {
    MagicWrapper,
    PreGame,
  },

  props: {
    data: Object,
    actor: Object,
  },

  data() {
    return {
      game: null,
    }
  },

  computed: {
    ...mapState('magic/cards', {
      cardLookup: 'lookup',
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
    prepGame() {
      const game = new mag.Magic(this.data, this.actor.name)
      game.cardLookup = this.cardLookup
      game.run()
      this.game = game

      document.title = this.game.settings.name
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
