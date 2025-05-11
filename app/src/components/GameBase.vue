<template>
  <div v-if="!gameReady">
    Loading...
  </div>

  <CubeDraft v-else-if="gameType === 'Cube Draft' || gameType === 'Set Draft'" />
  <MtgGame v-else-if="gameType === 'Magic'" />
  <InnovationGame v-else-if="gameType === 'Innovation'" />
  <Ultimate v-else-if="gameType === 'Innovation: Ultimate'" />
  <TyrantsGame v-else-if="gameType === 'Tyrants of the Underdark'" />

  <div v-else>
    error, unknown game type: {{ gameType }}
  </div>

  <SavingOverlay />
</template>

<script>
import { computed } from 'vue'
import { mapState } from 'vuex'
import mitt from 'mitt'

import CubeDraft from '@/modules/games/cube_draft/components/CubeDraft'
import InnovationGame from '@/modules/games/inn/components/InnovationGame'
import Ultimate from '@/modules/games/ultimate/components/Ultimate'
import MtgGame from '@/modules/games/magic/components/MtgGame'
import TyrantsGame from '@/modules/games/tyrants/components/TyrantsGame'

import SavingOverlay from '@/modules/games/common/components/SavingOverlay'


export default {
  name: 'GameBase',

  components: {
    CubeDraft,
    InnovationGame,
    MtgGame,
    TyrantsGame,
    Ultimate,

    SavingOverlay,
  },

  data() {
    return {
      id: this.$route.params.id,
      actor: this.$store.getters['auth/user'],
      bus: mitt(),
    }
  },

  provide() {
    return {
      actor: this.actor,
      bus: this.bus,
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
