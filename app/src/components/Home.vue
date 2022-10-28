<template>
<div class="home">
  <Header />

  <div class="container">
    <div class="row">
      <div class="col">

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
