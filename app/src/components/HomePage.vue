<template>
  <div class="home">
    <GameHeader />

    <div class="container">
      <div class="row justify-content-center">
        <div class="col games-col">

          <MyGames />

          <MyLobbies />

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import GameHeader from './GameHeader.vue'
import MyGames from './MyGames.vue'
import MyLobbies from './MyLobbies.vue'

export default {
  name: 'HomePage',
  components: {
    GameHeader,
    MyGames,
    MyLobbies,
  },
  data() {
    return {
    }
  },
}
</script>


<style scoped>
.games-col {
  max-width: 1000px;
}


</style>
