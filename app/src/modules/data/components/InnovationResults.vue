<template>
  <div class="innovation-stats container">
    <Header />

    <template v-if="!!data">
      <div class="stats-header alert alert-primary">
        <div><h3>Innovation Game Stats</h3></div>
        <div>Based on data from {{ data.count }} games.</div>
      </div>

      <div class="row">
        <div class="col">

          <h4>Win Conditions</h4>

          <table class="table table-sm">
            <thead>
              <tr>
                <th>condition</th>
                <th>count</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(result, index) in data.reasons" :key="index">
                <td>{{ result[0] }}</td>
                <td>{{ result[1] }}</td>
              </tr>
            </tbody>
          </table>

        </div>

        <div class="col">
          <h4>Card Data</h4>

          <table class="table table-sm">
            <thead>
              <tr>
                <th>card</th>
                <th>melded</th>
                <th>wins</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="([card, datum], index) in data.cards" :key="index">
                <td>{{ card }}</td>
                <td>{{ datum.melded }}</td>
                <td>{{ datum.wins }}&nbsp({{ Math.floor(datum.wins/datum.melded * 100) }}%)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </template>

    <template v-else>
      loading...
    </template>

  </div>
</template>


<script>
import axios from 'axios'

import { util } from 'battlestar-common'

import Header from '@/components/Header'


export default {
  name: 'InnovationWinData',

  components: {
    Header,
  },

  data() {
    return {
      data: null,
    }
  },

  computed: {
  },

  async created() {
    const requestResult = await axios.post('/api/game/stats/innovation')
    this.data = requestResult.data.data
  },
}
</script>


<style scoped>
.stats-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
