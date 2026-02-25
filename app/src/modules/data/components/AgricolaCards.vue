<template>
  <div class="agricola-cards container">
    <GameHeader />

    <h3 class="mb-3">Agricola Cards</h3>

    <div class="filters mb-3">
      <input
        type="text"
        class="form-control form-control-sm d-inline-block w-auto me-2"
        v-model="search"
        placeholder="Search by name..."
      />
      <select
        v-if="activeTab !== 'major'"
        v-model="selectedSet"
        class="form-select form-select-sm d-inline-block w-auto"
      >
        <option value="">All Sets</option>
        <option v-for="set in availableSets" :key="set.id" :value="set.id">
          {{ set.name }}
        </option>
      </select>
    </div>

    <ul class="nav nav-tabs mb-3">
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeTab === 'occupations' }" @click="switchTab('occupations')">
          Occupations ({{ occupationCards.length }})
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeTab === 'minor' }" @click="switchTab('minor')">
          Minor Improvements ({{ minorCards.length }})
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{ active: activeTab === 'major' }" @click="switchTab('major')">
          Major Improvements ({{ majorCards.length }})
        </a>
      </li>
    </ul>

    <div class="row">
      <div class="col">
        <!-- Occupations Table -->
        <table v-if="activeTab === 'occupations'" class="table table-sm table-striped">
          <thead>
            <tr>
              <th @click="sort('name')" class="sortable">Name</th>
              <th @click="sort('deck')" class="sortable">Set</th>
              <th @click="sort('players')" class="sortable">Players</th>
              <th>Text</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="card in occupationCards" :key="card.id">
              <td>{{ card.name }}</td>
              <td>{{ formatDeck(card.deck) }}</td>
              <td>{{ card.players }}</td>
              <td>{{ formatText(card.text) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Minor Improvements Table -->
        <table v-if="activeTab === 'minor'" class="table table-sm table-striped">
          <thead>
            <tr>
              <th @click="sort('name')" class="sortable">Name</th>
              <th @click="sort('deck')" class="sortable">Set</th>
              <th @click="sort('cost')" class="sortable">Cost</th>
              <th>Prerequisites</th>
              <th>Text</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="card in minorCards" :key="card.id">
              <td>{{ card.name }}</td>
              <td>{{ formatDeck(card.deck) }}</td>
              <td>{{ formatCost(card.cost) }}</td>
              <td>{{ formatPrereqs(card.prereqs) }}</td>
              <td>{{ formatText(card.text) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Major Improvements Table -->
        <table v-if="activeTab === 'major'" class="table table-sm table-striped">
          <thead>
            <tr>
              <th @click="sort('name')" class="sortable">Name</th>
              <th @click="sort('cost')" class="sortable">Cost</th>
              <th @click="sort('victoryPoints')" class="sortable">VP</th>
              <th>Text</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="card in majorCards" :key="card.id">
              <td>{{ card.name }}</td>
              <td>{{ formatCost(card.cost) }}</td>
              <td>{{ card.victoryPoints }}</td>
              <td>{{ formatText(card.text) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script>
import GameHeader from '@/components/GameHeader.vue'
import { agricola } from 'battlestar-common'

const res = agricola.res

export default {
  name: 'AgricolaCards',

  components: {
    GameHeader,
  },

  data() {
    return {
      allCards: [],
      allMajors: [],
      activeTab: 'occupations',
      search: '',
      selectedSet: '',
      sortField: 'name',
      sortDir: 1,
    }
  },

  computed: {
    searchLower() {
      return this.search.toLowerCase()
    },

    searchedOccupations() {
      return this.allCards
        .filter(c => c.type === 'occupation')
        .filter(c => !this.searchLower || c.name.toLowerCase().includes(this.searchLower))
    },

    searchedMinors() {
      return this.allCards
        .filter(c => c.type === 'minor')
        .filter(c => !this.searchLower || c.name.toLowerCase().includes(this.searchLower))
    },

    searchedMajors() {
      return this.allMajors
        .filter(c => !this.searchLower || c.name.toLowerCase().includes(this.searchLower))
    },

    occupationCards() {
      let cards = this.searchedOccupations
      if (this.activeTab === 'occupations' && this.selectedSet) {
        cards = cards.filter(c => c.deck === this.selectedSet)
      }
      return this.sortCards(cards)
    },

    minorCards() {
      let cards = this.searchedMinors
      if (this.activeTab === 'minor' && this.selectedSet) {
        cards = cards.filter(c => c.deck === this.selectedSet)
      }
      return this.sortCards(cards)
    },

    majorCards() {
      return this.sortCards(this.searchedMajors)
    },

    availableSets() {
      let cards
      if (this.activeTab === 'occupations') {
        cards = this.allCards.filter(c => c.type === 'occupation')
      }
      else {
        cards = this.allCards.filter(c => c.type === 'minor')
      }
      const deckIds = [...new Set(cards.map(c => c.deck))]
      return deckIds
        .map(id => ({ id, name: res.cardSets[id]?.name || id }))
        .sort((a, b) => a.name.localeCompare(b.name))
    },
  },

  methods: {
    switchTab(tab) {
      this.activeTab = tab
      this.selectedSet = ''
      this.sortField = 'name'
      this.sortDir = 1
    },

    sort(field) {
      if (this.sortField === field) {
        this.sortDir *= -1
      }
      else {
        this.sortField = field
        this.sortDir = 1
      }
    },

    sortCards(cards) {
      const sorted = [...cards]
      const { sortField, sortDir } = this
      sorted.sort((a, b) => {
        let aVal, bVal
        if (sortField === 'cost') {
          aVal = this.totalCost(a.cost)
          bVal = this.totalCost(b.cost)
        }
        else if (sortField === 'deck') {
          aVal = this.formatDeck(a.deck)
          bVal = this.formatDeck(b.deck)
        }
        else {
          aVal = a[sortField] ?? ''
          bVal = b[sortField] ?? ''
        }
        if (typeof aVal === 'string') {
          return sortDir * aVal.localeCompare(bVal)
        }
        return sortDir * (aVal - bVal)
      })
      return sorted
    },

    totalCost(cost) {
      if (!cost || typeof cost !== 'object') {
        return 0
      }
      return Object.values(cost).reduce((sum, v) => sum + v, 0)
    },

    formatText(text) {
      if (Array.isArray(text)) {
        return text.join('; ')
      }
      return text || ''
    },

    formatCost(cost) {
      if (!cost || Object.keys(cost).length === 0) {
        return 'Free'
      }
      return Object.entries(cost).map(([k, v]) => `${v} ${k}`).join(', ')
    },

    formatPrereqs(prereqs) {
      if (!prereqs) {
        return ''
      }
      const parts = []
      for (const [key, value] of Object.entries(prereqs)) {
        if (key === 'occupationsAtMost') {
          continue
        }
        const label = key.replace(/([A-Z])/g, ' $1').toLowerCase()
        if (key === 'occupations' && prereqs.occupationsAtMost) {
          parts.push(`at most ${value} ${label}`)
        }
        else {
          parts.push(`${value} ${label}`)
        }
      }
      return parts.join(', ')
    },

    formatDeck(deck) {
      return res.cardSets[deck]?.name || deck
    },
  },

  created() {
    this.allCards = res.getAllCards()
    this.allMajors = res.getAllMajorImprovements(6)
  },
}
</script>


<style scoped>
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
