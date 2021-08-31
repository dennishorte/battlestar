<template>
<div class="home">
  <Header />

  <b-container>
    <b-row>
      <b-col>

        <MyGames />

        <MyLobbies />

      </b-col>
    </b-row>
  </b-container>

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
