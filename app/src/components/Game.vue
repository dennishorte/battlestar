<template>
  <div class="game">

    <Battlestar v-if="game === 'Battlestar Galactica'" :data="gameData" />
    <div v-else>
      Loading...
      ...or maybe unknown game '{{ this.game }}'
    </div>

  </div>
</template>

<script>
 import axios from 'axios'
 import Battlestar from '@/modules/games/battlestar/components/Battlestar'

 export default {
   name: 'Game',
   components: {
     Battlestar,
   },
   data() {
     return {
       id: this.$route.params.id,
       game: null,
       gameData: null,
     }
   },

   async mounted() {
     const requestResult = await axios.post('/api/game/fetch', {
       gameId: this.id,
     })
     if (requestResult.data.status === 'success') {
       await this.$store.dispatch('bsg/load', requestResult.data.game)
       this.game = requestResult.data.game.game
     }
     else {
       alert('Error loading game data')
     }
   },
 }
</script>
