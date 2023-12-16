<template>
  <CubeDraft
    v-if="gameType === 'CubeDraft'"
    :data="gameData"
    :actor="actor"
  />

  <Magic
    v-else-if="gameType === 'Magic'"
    :data="gameData"
    :actor="actor"
  />

  <Innovation v-else-if="gameType === 'Innovation'" />
  <Tyrants v-else-if="gameType === 'Tyrants of the Underdark'" />

  <div v-else>
    Loading...
    ...or maybe unknown game '{{ this.gameType }}'
  </div>
</template>

<script>
import { computed } from 'vue'
import { fromData } from 'battlestar-common'

import CubeDraft from '@/modules/games/cube_draft/components/CubeDraft'
import Innovation from '@/modules/games/inn/components/Innovation'
import Magic from '@/modules/games/magic/components/Magic'
import Tyrants from '@/modules/games/tyrants/components/Tyrants'


export default {
  name: 'Game',

  components: {
    CubeDraft,
    Innovation,
    Magic,
    Tyrants,
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
    gameData() {
      this.game ? this.game.serialize() : {}
    },

    gameType() {
      return this.game ? this.game.settings.game : null
    },
  },

  methods: {
    async loadGame() {
      if (!this.id) {
        return this.nextGame()
      }

      const { game } = await this.$post('/api/game/fetch', {
        gameId: this.id,
      })

      this.game = fromData(game)
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

    async save(game) {
      const response = await this.$post('/api/game/saveFull', game.serialize())
      game.usedUndo = false
      game.branchId = response.branchId
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
