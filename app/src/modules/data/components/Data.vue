<template>
  <div class="data">
    <Header />

    <b-container>
      <b-row>
        <b-col>
          <ul>
            <li><router-link to="/data/innovation/cards">Innovation Cards</router-link></li>
            <li><router-link to="/data/innovation/results">Innovation Results</router-link></li>
          </ul>
        </b-col>
      </b-row>
    </b-container>
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
