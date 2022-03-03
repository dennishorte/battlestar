<template>
  <div class="game">

    <Battlestar
      v-if="game === 'Battlestar Galactica'"
      :data="gameData"
      :actor="actor"
    />

    <Innovation
      v-else-if="game === 'Innovation'"
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
import Battlestar from '@/modules/games/battlestar/components/Battlestar'
import Innovation from '@/modules/games/inn/components/Innovation'

export default {
  name: 'Game',
  components: {
    Battlestar,
    Innovation,
  },
  data() {
    return {
      id: this.$route.params.id,
      actor: {},
      game: '',
      gameData: {},
    }
  },

  async mounted() {
    const requestResult = await axios.post('/api/game/fetch', {
      gameId: this.id,
    })
    if (requestResult.data.status === 'success') {
      const data = requestResult.data.game
      this.game = data.settings ? data.settings.game : data.game

      if (this.game === 'Battlestar Galactica') {
        this.$game.setState(requestResult.data.game)
        this.$game.setActor(this.$store.getters['auth/user'])
      }
      else if (this.game === 'Innovation') {
        this.gameData = requestResult.data.game
        this.actor = this.$store.getters['auth/user']
      }
    }
    else {
      alert('Error loading game data')
    }
  },
}
</script>
