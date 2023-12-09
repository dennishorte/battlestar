<template>
  <CubeDraft
    v-if="gameType === 'CubeDraft'"
    :data="gameData"
    :actor="actor"
  />

  <Innovation
    v-else-if="gameType === 'Innovation'"
    :data="gameData"
    :actor="actor"
  />

  <Magic
    v-else-if="gameType === 'Magic'"
    :data="gameData"
    :actor="actor"
  />

  <Tyrants
    v-else-if="gameType === 'Tyrants of the Underdark'"
    :data="gameData"
    :actor="actor"
  />

  <div v-else>
    Loading...
    ...or maybe unknown game '{{ this.gameType }}'
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
      gameType: '',
      gameData: {},
    }
  },

  provide() {
    return {
      actor: this.actor,
      chat: this.chat,
      save: this.save,
    }
  },

  methods: {
    async chat(text) {
      console.log('chat', text)
    },

    async loadGame() {
      if (!this.id) {
        return this.nextGame()
      }

      this.gameType = ''

      const { game } = await this.$post('/api/game/fetch', {
        gameId: this.id,
      })

      this.gameType = game.settings.game
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

    async save(game) {
      const response = await this.$post('/api/game/saveFull', this.game.serialize())
      this.game.usedUndo = false
      this.game.branchId = response.branchId
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
