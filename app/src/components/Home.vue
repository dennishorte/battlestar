<template>
  <div class="home">
    <Header />

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
import Header from './Header'
import MyGames from './MyGames'
import MyLobbies from './MyLobbies'

export default {
  name: 'Home',
  components: {
    Header,
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
