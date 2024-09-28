<template>
  <CubeDraft v-if="gameType === 'CubeDraft'" />
  <Magic v-else-if="gameType === 'Magic'" />
  <Innovation v-else-if="gameType === 'Innovation'" />
  <Tyrants v-else-if="gameType === 'Tyrants of the Underdark'" />

  <div v-else>
    Loading...
    ...or maybe unknown game '{{ this.gameType }}'
  </div>

  <SavingOverlay />
</template>

<script>
import { computed, nextTick } from 'vue'
import { mapState } from 'vuex'
import { fromData } from 'battlestar-common'

import CubeDraft from '@/modules/games/cube_draft/components/CubeDraft'
import Innovation from '@/modules/games/inn/components/Innovation'
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
      save: this.save,
    }
  },

  computed: {
    ...mapState('game', {
      game: 'game',
      saving: 'saving',
    }),

    gameType() {
      return this.game ? this.game.settings.game : null
    },
  },

  methods: {
    async loadGame() {
      this.$store.commit('game/setGame', null)
      await nextTick()

      if (!this.id) {
        throw new Error('unexpected')
        return this.nextGame()
      }

      const response = await this.$post('/api/game/fetch', {
        gameId: this.id,
      })

      const game = fromData(response.game, this.actor.name)
      game.run()
      this.$store.commit('game/setGame', game)
    },

    async nextGame() {
      const { gameId } = await this.$post('/api/user/next', {
        userId: this.actor._id,
        gameId: null,
      })

      if (gameId) {
        if (this.$route.path === `/game/${gameId}`) {
          this.$router.go()
        }
        else {
          this.$router.push(`/game/${gameId}`)
        }
      }
      else {
        this.$router.push('/')
      }
    },

    delay(milliseconds){
      return new Promise(resolve => {
        setTimeout(resolve, milliseconds)
      })
    },

    async save(game) {
      while (this.saving) {
        console.log('blocked')
        this.$store.commit('game/setSaveQueued', true)
        await this.delay(500)
      }

      this.$store.commit('game/setSaveQueued', false)
      this.$store.commit('game/setSaving', true)

      // If the player used undo, first execute and save the undone state.
      // This is done so that, in the general case, we only ever need to save the latest action of the
      // user and there is no need to save the whole state. This allows actions to be played asynchronously
      // in games like Cube Draft, where the relative order of the user actions doesn't matter.
      if (game.undoCount > 0) {
        await this.$post('/api/game/undo', {
          gameId: game._id,
          count: game.undoCount,
        })
      }

      const response = await this.$post('/api/game/saveFull', game.serialize())
      game.undoCount = 0
      game.branchId = response.branchId
      this.$store.commit('game/setSaving', false)
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
