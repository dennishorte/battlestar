<template>
  <div class="data">
    <Header />

    <div class="container">
      <div class="row">
        <div class="col">
          <ul>
            <li><router-link to="/data/innovation/cards">Innovation Cards</router-link></li>
            <li><router-link to="/data/innovation/results">Innovation Results</router-link></li>
            <li><router-link to="/data/tyrants/cards">Tyrants Cards</router-link></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Header from '../../../components/Header'

export default {
  name: 'Data',

  components: {
    Header,
  },
}
</script>


<style scoped>
</style>
