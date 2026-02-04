<template>
  <div class="agricola-stats container">
    <GameHeader />

    <template v-if="!!data">
      <div class="stats-header alert alert-primary">
        <div><h3>Agricola Game Stats</h3></div>
        <div>Based on data from {{ data.count }} games.</div>
      </div>

      <div class="filters mb-3">
        <label class="me-2">Player Count:</label>
        <select v-model="selectedPlayerCount" class="form-select form-select-sm d-inline-block w-auto">
          <option value="all">All</option>
          <option v-for="count in availablePlayerCounts" :key="count" :value="count">
            {{ count }} players
          </option>
        </select>
      </div>

      <ul class="nav nav-tabs mb-3">
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'occupations' }" @click="activeTab = 'occupations'">
            Occupations
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'minor' }" @click="activeTab = 'minor'">
            Minor Improvements
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'major' }" @click="activeTab = 'major'">
            Major Improvements
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'draft' }" @click="activeTab = 'draft'">
            Draft Stats
          </a>
        </li>
      </ul>

      <div class="row">
        <div class="col">
          <!-- Card Stats Table -->
          <template v-if="activeTab !== 'draft'">
            <table class="table table-sm table-striped">
              <thead>
                <tr>
                  <th @click="sortBy('name')" class="sortable">Card</th>
                  <th @click="sortBy('setId')" class="sortable">Set</th>
                  <th @click="sortBy('played')" class="sortable">Played</th>
                  <th @click="sortBy('wins')" class="sortable">Wins</th>
                  <th @click="sortBy('winRate')" class="sortable">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="([name, datum], index) in filteredCards" :key="index">
                  <td>{{ name }}</td>
                  <td>{{ datum.setId }}</td>
                  <td>{{ datum.played }}</td>
                  <td>{{ datum.wins }}</td>
                  <td>{{ formatPercent(datum.wins, datum.played) }}</td>
                </tr>
              </tbody>
            </table>
          </template>

          <!-- Draft Stats Table -->
          <template v-else>
            <table class="table table-sm table-striped">
              <thead>
                <tr>
                  <th @click="sortDraftBy('name')" class="sortable">Card</th>
                  <th @click="sortDraftBy('type')" class="sortable">Type</th>
                  <th @click="sortDraftBy('setId')" class="sortable">Set</th>
                  <th @click="sortDraftBy('drafted')" class="sortable">Drafted</th>
                  <th @click="sortDraftBy('avgPickOrder')" class="sortable">Avg Pick</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="([name, datum], index) in filteredDraft" :key="index">
                  <td>{{ name }}</td>
                  <td>{{ datum.type }}</td>
                  <td>{{ datum.setId }}</td>
                  <td>{{ datum.drafted }}</td>
                  <td>{{ datum.avgPickOrder.toFixed(1) }}</td>
                </tr>
              </tbody>
            </table>
          </template>
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
  name: 'AgricolaResults',

  components: {
    GameHeader,
  },

  data() {
    return {
      data: null,
      activeTab: 'occupations',
      selectedPlayerCount: 'all',
    }
  },

  computed: {
    availablePlayerCounts() {
      if (!this.data) {
        return []
      }
      return Object.keys(this.data.byPlayerCount).map(Number).sort()
    },

    currentData() {
      if (!this.data) {
        return null
      }
      if (this.selectedPlayerCount === 'all') {
        return this.data.aggregate
      }
      return this.data.byPlayerCount[this.selectedPlayerCount] || this.data.aggregate
    },

    filteredCards() {
      if (!this.currentData) {
        return []
      }
      const cards = this.currentData.cards || []
      const typeFilter = this.activeTab
      return cards.filter(([, datum]) => {
        if (typeFilter === 'occupations') {
          return datum.type === 'occupation'
        }
        if (typeFilter === 'minor') {
          return datum.type === 'minor'
        }
        if (typeFilter === 'major') {
          return datum.type === 'major'
        }
        return true
      })
    },

    filteredDraft() {
      if (!this.currentData) {
        return []
      }
      return this.currentData.draft || []
    },
  },

  methods: {
    formatPercent(wins, played) {
      if (played === 0) {
        return '0%'
      }
      return Math.floor(wins / played * 100) + '%'
    },

    sortBy(field) {
      const cards = this.currentData?.cards
      if (!cards) {
        return
      }

      if (field === 'name') {
        cards.sort((l, r) => l[0].localeCompare(r[0]))
      }
      else if (field === 'setId') {
        cards.sort((l, r) => (l[1].setId || '').localeCompare(r[1].setId || ''))
      }
      else if (field === 'played') {
        cards.sort((l, r) => r[1].played - l[1].played)
      }
      else if (field === 'wins') {
        cards.sort((l, r) => r[1].wins - l[1].wins)
      }
      else if (field === 'winRate') {
        cards.sort((l, r) => {
          const lRate = l[1].played > 0 ? l[1].wins / l[1].played : 0
          const rRate = r[1].played > 0 ? r[1].wins / r[1].played : 0
          return rRate - lRate
        })
      }
    },

    sortDraftBy(field) {
      const draft = this.currentData?.draft
      if (!draft) {
        return
      }

      if (field === 'name') {
        draft.sort((l, r) => l[0].localeCompare(r[0]))
      }
      else if (field === 'type') {
        draft.sort((l, r) => (l[1].type || '').localeCompare(r[1].type || ''))
      }
      else if (field === 'setId') {
        draft.sort((l, r) => (l[1].setId || '').localeCompare(r[1].setId || ''))
      }
      else if (field === 'drafted') {
        draft.sort((l, r) => r[1].drafted - l[1].drafted)
      }
      else if (field === 'avgPickOrder') {
        draft.sort((l, r) => l[1].avgPickOrder - r[1].avgPickOrder)
      }
    },
  },

  async created() {
    const { data } = await this.$post('/api/game/stats/agricola')
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

.nav-link {
  cursor: pointer;
}
</style>
