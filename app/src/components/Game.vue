<template>
  <div class="game">

    <Innovation
      v-if="game === 'Innovation'"
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
import axios from 'axios'
import Innovation from '@/modules/games/inn/components/Innovation'
import Tyrants from '@/modules/games/tyrants/components/Tyrants'

export default {
  name: 'Game',

  components: {
    Innovation,
    Tyrants,
  },

  data() {
    return {
      id: this.$route.params.id,
      actor: {},
      game: '',
      gameData: {},
    }
  },

  methods: {
    async loadGame() {
      this.game = ''

      const requestResult = await axios.post('/api/game/fetch', {
        gameId: this.id,
      })

      if (requestResult.data.status === 'success') {
        const data = requestResult.data.game
        this.game = data.settings ? data.settings.game : data.game
        this.gameData = requestResult.data.game
        this.actor = this.$store.getters['auth/user']
      }
      else {
        alert('Error loading game data')
      }
    }
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
