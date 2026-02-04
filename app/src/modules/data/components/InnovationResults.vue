<template>
  <div class="innovation-stats container">
    <GameHeader />

    <template v-if="!!data">
      <div class="stats-header alert alert-primary">
        <div><h3>Innovation Game Stats</h3></div>
        <div>Based on data from {{ data.count }} games.</div>
      </div>

      <div class="row">
        <div class="col-4">

          <h4>Win Conditions</h4>

          <table class="table table-sm table-striped">
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

        <div class="col-8">
          <h4>Card Data</h4>

          <table class="table table-sm table-striped">
            <thead>
              <tr>
                <th @click="sortBy('name')" class="sortable">card</th>
                <th @click="sortBy('age')" class="sortable">age</th>
                <th @click="sortBy('melded')" class="sortable">melded</th>
                <th @click="sortBy('wins')" class="sortable">wins</th>
                <th @click="sortBy('winRate')" class="sortable">win rate</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="([card, datum], index) in data.cards" :key="index">
                <td>{{ card }}</td>
                <td>{{ datum.age ?? '?' }}</td>
                <td>{{ datum.melded }}</td>
                <td>{{ datum.wins }}</td>
                <td>{{ formatPercent(datum.wins, datum.melded) }}</td>
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
import GameHeader from '@/components/GameHeader.vue'

export default {
  name: 'InnovationResults',

  components: {
    GameHeader,
  },

  data() {
    return {
      data: null,
    }
  },

  methods: {
    formatPercent(wins, melded) {
      if (melded === 0) {
        return '0%'
      }
      return Math.floor(wins / melded * 100) + '%'
    },

    sortBy(field) {
      if (!this.data?.cards) {
        return
      }

      if (field === 'name') {
        this.data.cards.sort((l, r) => l[0].localeCompare(r[0]))
      }
      else if (field === 'winRate') {
        this.data.cards.sort((l, r) => {
          const lRate = l[1].melded > 0 ? l[1].wins / l[1].melded : 0
          const rRate = r[1].melded > 0 ? r[1].wins / r[1].melded : 0
          return rRate - lRate
        })
      }
      else if (field === 'age') {
        this.data.cards.sort((l, r) => {
          const lAge = l[1].age ?? 99
          const rAge = r[1].age ?? 99
          return lAge - rAge
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

.sortable {
  cursor: pointer;
}

.sortable:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
