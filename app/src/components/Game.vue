<template>
  <div class="game">

    <Battlestar v-if="game === 'Battlestar Galactica'" />
    <div v-else>
      Unknown game: {{ game }}
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
     }
   },

   async mounted() {
     const requestResult = await axios.post('/api/game/fetch', {
       gameId: this.id,
     })
     if (requestResult.data.status === 'success') {
       this.game = requestResult.data.game.game
       console.log('Loaded game data: ', requestResult.data.game)
     }
     else {
       alert('Error loading game data')
     }
   },
 }
</script>
