<template>
  <div class="card-list">

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div>
      <button class="btn btn-sm btn-info" @click="updateLocalCards">update</button>
    </div>

    Card List

    <div v-for="name in cardNames" :key="name" class="game-card" @click="highlightCard(name)">
      {{ name }}
    </div>
  </div>
</template>


<script>
import axios from 'axios'

import { util } from 'battlestar-common'


const numberFields = ['cmc', 'power', 'toughness', 'loyalty']
const textFields = ['name', 'text', 'flavor', 'type']
const fieldMapping = {
  cmc: 'cmc',
  name: 'name',
  text: 'oracle_text',
  flavor: 'flavor_text',
  type: 'type_line',
  power: 'power',
  toughness: 'toughness',
  loyalty: 'loyalty',
}

export default {
  name: 'CardList',

  inject: ['bus'],

  data() {
    return {
      cards: [],
      cardsFiltered: [],

      db: null,
      highlight: {},
      error: '',
    }
  },

  computed: {
    cardNames() {
      return util.array.distinct(this.cardsFiltered.map(c => c.name)).sort()
    },
  },

  methods: {
    applyFilters(filters) {
      if (filters.length === 0) {
        this.filteredCards = this.cards
      }

      this.cardsFiltered = this
        .cards
        .filter(card => filters.every(filter => {
          if (filter.kind === 'legality' && 'legalities' in card) {
            return card.legalities[filter.value] === 'legal'
          }
          else if (textFields.includes(filter.kind)) {
            const fieldKey = fieldMapping[filter.kind]
            const fieldValue = fieldKey in card ? card[fieldKey].toLowerCase() : ''
            const targetValue = filter.value.toLowerCase()

            if (filter.operator === 'and') {
              return fieldValue.includes(targetValue)
            }
            else if (filter.operator === 'not') {
              return !fieldValue.includes(targetValue)
            }
            else {
              throw new Error(`Unhandled string operator: ${filter.operator}`)
            }
          }
          else if (numberFields.includes(filter.kind)) {
            const fieldKey = fieldMapping[filter.kind]
            const fieldValue = fieldKey in card ? parseFloat(card[fieldKey]) : -999
            const targetValue = parseFloat(filter.value)

            if (fieldValue === -999) {
              return false
            }
            else if (filter.operator === '=') {
              return fieldValue === targetValue
            }
            else if (filter.operator === '>=') {
              return fieldValue >= targetValue
            }
            else if (filter.operator === '<=') {
              return fieldValue <= targetValue
            }
            else {
              throw new Error(`Unhandled numeric operator: ${filter.operator}`)
            }
          }
          else {
            throw new Error(`Unhandled filter field: ${filter.kind}`)
          }

          return false
        }))
    },

    highlightCard(name) {
      const card = this.cardsFiltered.find(c => c.name === name)
      this.bus.emit('highlight-card', card)
    },

    async loadCardsFromDatabase() {
      console.log('loadCardsFromDatabase')
      const objectStore = this.db.transaction('cards').objectStore('cards')

      objectStore.openCursor().addEventListener('success', (e) => {
        // Get a reference to the cursor
        const cursor = e.target.result;

        // If there is still another data item to iterate through, keep running this code
        if (cursor) {
          console.log('Cursor iteration')
          this.cards = cursor.value.json_data
          this.cardsFiltered = this.cards
          cursor.continue()
        }
        else {
          console.log('all values loaded')
        }
      })
    },

    async openLocalStorage() {
      const openRequest = window.indexedDB.open('cards', 1)

      openRequest.addEventListener('error', () => {
        console.error('Database failed to open')
        this.error = 'Database failed to open'
      })

      openRequest.addEventListener('success', () => {
        console.log('Database opened successfully')
        this.db = openRequest.result
        this.loadCardsFromDatabase()
      })

      openRequest.addEventListener('upgradeneeded', (e) => {
        this.db = e.target.result

        console.log(`Upgrading database to version ${this.db.version}`)

        // Create an objectStore in our database to store notes and an auto-incrementing key
        // An objectStore is similar to a 'table' in a relational database
        const objectStore = this.db.createObjectStore('cards', {
          keyPath: 'id',
          autoIncrement: true,
        })

        // Define what data items the objectStore will contain
        objectStore.createIndex('json_data', 'json_data', { unique: false })

        console.log('Database setup complete')
      })
    },

    async saveCardsToDatabase(cards) {
      const newItem = { json_data: cards }

      const transaction = this.db.transaction(['cards'], 'readwrite')
      const objectStore = transaction.objectStore('cards')
      const addRequest = objectStore.add(newItem)

      // What is the difference between success and complete?
      addRequest.addEventListener('success', () => {})

      transaction.addEventListener('complete', () => {
        console.log('Transaction completed: database modification finished.')
        this.loadCardsFromDatabase()
      })

      transaction.addEventListener('error', () => {
        this.error = 'Unable to save cards to database'
      })
    },

    // This fetches the latest card data from the database and stores it locally
    // in an IndexedDB.
    async updateLocalCards() {
      console.log('fetching card data')
      const requestResult = await axios.post('/api/card/all')
      console.log('card data fetched')

      if (requestResult.data.status === 'success') {
        await this.saveCardsToDatabase(requestResult.data.cards)
        await this.loadCardsFromDatabase()
      }
      else {
        alert('Error loading game data')
      }
    },
  },

  created() {
    this.openLocalStorage()
  },

  mounted() {
    this.bus.on('card-filter', this.applyFilters)
  },
}
</script>


<style scoped>
.card-list {
  display: flex;
  flex-direction: column;
  font-size: .8em;
  max-width: 15em;
  max-height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
}

.game-card {
  white-space: nowrap;
  overflow: hidden;
  min-height: 1.4em;
}
</style>
