<template>
<div class="home">
  <Header />

  <b-container>
    <b-row>
      <b-col>

        <MyLobbies />

      </b-col>
    </b-row>
  </b-container>

</div>
</template>

<script>
import Header from './Header'
import MyLobbies from './MyLobbies'

export default {
  name: 'Home',
  components: {
    Header,
    MyLobbies,
  },
  data() {
    return {
    }
  },
}
</script>
