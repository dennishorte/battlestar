<template>
  <div v-if="!gameReady">
    Loading...
  </div>

  <CubeDraft v-else-if="gameType === 'CubeDraft'" />
  <Magic v-else-if="gameType === 'Magic'" />
  <Innovation v-else-if="gameType === 'Innovation'" />
  <Ultimate v-else-if="gameType === 'Innovation: Ultimate'" />
  <Tyrants v-else-if="gameType === 'Tyrants of the Underdark'" />

  <div v-else>
    error
  </div>

  <SavingOverlay />
</template>

<script>
import { computed } from 'vue'
import { mapState } from 'vuex'

import CubeDraft from '@/modules/games/cube_draft/components/CubeDraft'
import Innovation from '@/modules/games/inn/components/Innovation'
import Ultimate from '@/modules/games/ultimate/components/Ultimate'
import Magic from '@/modules/games/magic/components/Magic'
import Tyrants from '@/modules/games/tyrants/components/Tyrants'

import SavingOverlay from '@/modules/games/common/components/SavingOverlay'


export default {
  name: 'Game',

  components: {
    CubeDraft,
    Innovation,
    Magic,
    Tyrants,
    Ultimate,

    SavingOverlay,
  },

  data() {
    return {
      id: this.$route.params.id,
      actor: this.$store.getters['auth/user'],
    }
  },

  provide() {
    return {
      actor: this.actor,
      game: computed(() => this.game),
    }
  },

  computed: {
    ...mapState('game', {
      game: 'game',
      gameReady: 'gameReady',
      saving: 'saving',
    }),

    gameType() {
      return this.game ? this.game.settings.game : null
    },
  },

  methods: {
    async loadGame() {
      if (this.id === 'next') {
        await this.nextGame()
      }
      else {
        await this.$store.dispatch('game/load', {
          gameId: this.id,
          actor: this.actor,
        })
      }
    },

    async nextGame() {
      await this.$store.dispatch('game/next', { actor: this.actor })
    },
  },

  watch: {
    async $route() {
      this.id = this.$route.params.id
      await this.loadGame()
    },
  },

  async mounted() {
    await this.loadGame()
  },
}
</script>
