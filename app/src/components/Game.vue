<template>
  <div class="game" v-if="validVersion">

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

  </div>
</template>

<script>
import CubeDraft from '@/modules/games/cube_draft/components/CubeDraft'
import Innovation from '@/modules/games/inn/components/Innovation'
import Magic from '@/modules/games/magic/components/Magic'
import Tyrants from '@/modules/games/tyrants/components/Tyrants'

const appVersion = require('@/assets/version.js')


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
      actor: {},
      game: '',
      gameData: {},
      validVersion: false,
    }
  },

  methods: {
    async checkVersion() {
      this.validVersion = false

      const response = await this.$post('/api/appVersion')
      const latestVersion = response.version.value

      if (latestVersion !== appVersion) {
        alert('New version of app available. Please reload.')
      }
      else {
        this.validVersion = true
      }
    },

    async loadGame() {
      this.game = ''

      const { game } = await this.$post('/api/game/fetch', {
        gameId: this.id,
      })

      this.game = game.settings.game
      this.gameData = game
      this.actor = this.$store.getters['auth/user']
    }
  },

  watch: {
    async $route() {
      this.id = this.$route.params.id
      await this.checkVersion()
      await this.loadGame()
    },
  },

  async mounted() {
    await this.checkVersion()
    await this.loadGame()
  },
}
</script>
