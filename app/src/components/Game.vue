<template>
  <CubeDraft
    v-if="game === 'CubeDraft'"
    :data="gameData"
    :actor="actor"
  />

  <Innovation
    v-else-if="game === 'Innovation'"
    :data="gameData"
    :actor="actor"
  />

  <Magic
    v-else-if="game === 'Magic'"
    :data="gameData"
    :actor="actor"
  />

  <Tyrants
    v-else-if="game === 'Tyrants of the Underdark'"
    :data="gameData"
    :actor="actor"
  />

  <div v-else>
    Loading...
    ...or maybe unknown game '{{ this.game }}'
  </div>
</template>

<script>
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
      game: '',
      gameData: {},
    }
  },

  methods: {
    async loadGame() {
      if (!this.id) {
        return this.nextGame()
      }

      this.game = ''

      const { game } = await this.$post('/api/game/fetch', {
        gameId: this.id,
      })

      this.game = game.settings.game
      this.gameData = game
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
