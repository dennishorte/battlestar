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
      game: null,
    }
  },

  provide() {
    return {
      actor: this.actor,
      game: computed(() => this.game ),
      save: this.save,
    }
  },

  computed: {
    ...mapState('game', {
      saving: 'saving',
    }),

    gameType() {
      return this.game ? this.game.settings.game : null
    },
  },

  methods: {
    async loadGame() {
      this.game = null
      await nextTick()

      if (!this.id) {
        return this.nextGame()
      }

      const { game } = await this.$post('/api/game/fetch', {
        gameId: this.id,
      })

      this.game = fromData(game, this.actor.name)
      this.game.run()
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
      const response = await this.$post('/api/game/saveFull', game.serialize())
      game.usedUndo = false
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
