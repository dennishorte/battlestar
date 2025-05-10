<template>
  <div class="innovation-stats container">
    <GameHeader />

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
                <th @click="sortBy('age')">age</th>
                <th @click="sortBy('melded')">melded</th>
                <th @click="sortBy('wins')">wins</th>
                <th @click="sortBy('win rate')">win rate</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="([card, datum], index) in data.cards" :key="index">
                <td>{{ card }}</td>
                <td>{{ cardAge(card) }}</td>
                <td>{{ datum.melded }}</td>
                <td>{{ datum.wins }}</td>
                <td>{{ Math.floor(datum.wins/datum.melded * 100) }}%</td>
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
import { inn, util } from 'battlestar-common'

import GameHeader from '@/components/GameHeader'


export default {
  name: 'InnovationWinData',

  components: {
    GameHeader,
  },

  data() {
    return {
      data: null,
    }
  },

  computed: {
  },

  methods: {
    cardAge(cardName) {
      if (inn.res.byName[cardName]) {
        return inn.res.byName[cardName].age
      }
      else {
        console.log(cardName, inn.res.byName[cardName])
        return '?'
      }
    },

    sortBy(field) {
      if (field === 'win rate') {
        this.data.cards.sort((l, r) => {
          const l_rate = l[1].wins / l[1].melded
          const r_rate = r[1].wins / r[1].melded
          return r_rate - l_rate
        })
      }

      else if (field === 'age') {
        this.data.cards.sort((l, r) => {
          const l_age = this.cardAge(l[0])
          const r_age = this.cardAge(r[0])
          return r_age - l_age
        })
      }

      else if (field === 'melded') {
        this.data.cards.sort((l, r) => r[1].melded - l[1].melded)
      }

      else if (field === 'wins') {
        this.data.cards.sort((l, r) => r[1].wins - l[1].wins)
      }
    },
  },

  async created() {
    const { data } = await this.$post('/api/game/stats/innovation')
    this.data = data
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
