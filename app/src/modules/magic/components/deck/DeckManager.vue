<template>
  <div v-if="cardDatabase.loading" class="alert alert-warning">Loading card data</div>

  <div v-else class="container-fluid deck-manager">
    <div class="row flex-nowrap">

      <div class="col column filters-column">
        <DeckSelector :decks="decks" />
        <CardFilters />
      </div>

      <div class="col column cards-column">
        <Card :card="highlightedCard" />
        <button class="btn btn-sm btn-info" @click="updateLocalCards">update</button>

        <CardList />
      </div>

      <div class="col column">
        <DeckList v-if="activeDeck" :deck="activeDeck" />
      </div>

    </div>

    <CardManagerModal :card="editingCard" :cardLock="cardLock" />
  </div>

</template>


<script>
import { computed } from 'vue'
import axios from 'axios'
import mitt from 'mitt'

import testCard from './test_card.js'
import testDeck from './test_deck.js'

import Card from '../Card'

import CardFilters from './CardFilters'
import CardList from './CardList'
import CardManagerModal from './CardManagerModal'
import DeckList from './DeckList'
import DeckSelector from './DeckSelector'

export default {
  name: 'DeckManager',

  components: {
    Card,
    CardFilters,
    CardList,
    CardManagerModal,
    DeckList,
    DeckSelector,
  },

  data() {
    return {
      actor: this.$store.getters['auth/user'],
      bus: mitt(),

      cardDatabase: {
        db: null,
        loading: true,
        cards: [],
        lookup: {},
      },

      cards: [],
      decks: [testDeck],

      activeDeck: null,
      cardLock: false,
      editingCard: {},
      highlightedCard: testCard,
    }
  },

  provide() {
    return {
      allcards: computed(() => this.cardDatabase.cards),
      cardLookup: computed(() => this.cardDatabase.lookup),
      bus: this.bus,
    }
  },

  methods: {
    deckEditCard(card) {
      this.editingCard = card
      this.$modal('card-manager-modal').show()
    },

    highlightCard(card) {
      this.highlightedCard = card
    },

    selectDeck(deckData) {
      this.activeDeck = deckData
    },

    toggleCardLock() {
      this.cardLock = !this.cardLock
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Deck Fetching Methods

    async fetchAllDecks() {
      const requestResult = await axios.post('/api/user/decks', {
        userId: this.actor._id,
      })

      if (requestResult.data.status === 'success') {
        this.decks = requestResult.data.decks
      }
      else {
        alert('Error loading game data')
      }
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Card Database Management Methods


    async loadCardsFromDatabase() {
      console.log('loadCardsFromDatabase')
      const objectStore = this.cardDatabase.db.transaction('cards').objectStore('cards')

      objectStore.openCursor().addEventListener('success', (e) => {
        // Get a reference to the cursor
        const cursor = e.target.result;

        // If there is still another data item to iterate through, keep running this code
        if (cursor) {
          console.log('Cursor iteration')
          this.cardDatabase.cards = cursor
            .value
            .json_data
            .filter(card => Boolean(card.type_line) && !card.type_line.startsWith('Card'))
          cursor.continue()
        }
        else {
          console.log('all values loaded', this.cardDatabase.cards.length)
          this.cardDatabase.lookup = {}
          for (const card of this.cardDatabase.cards) {
            const cardNames = [card.name.toLowerCase()]

            if (card.card_faces) {
              for (const face of card.card_faces) {
                cardNames.push(face.name.toLowerCase())
              }
            }

            for (const cardName of cardNames) {
              if (cardName in this.cardDatabase.lookup) {
                this.cardDatabase.lookup[cardName].push(card)
              }
              else {
                this.cardDatabase.lookup[cardName] = [card]
              }
            }
          }
          this.cardDatabase.loading = false
        }
      })
    },

    async openLocalStorage() {
      const openRequest = window.indexedDB.open('cards', 1)

      /* openRequest.addEventListener('error', () => {
       *   console.error('Database failed to open')
       *   this.error = 'Database failed to open'
       * })
       */
      openRequest.addEventListener('success', () => {
        console.log('Database opened successfully')
        this.cardDatabase.db = openRequest.result
        this.loadCardsFromDatabase()
      })

      openRequest.addEventListener('upgradeneeded', (e) => {
        this.cardDatabase.db = e.target.result

        console.log(`Upgrading database to version ${this.cardDatabase.db.version}`)

        // Create an objectStore in our database to store notes and an auto-incrementing key
        // An objectStore is similar to a 'table' in a relational database
        const objectStore = this.cardDatabase.db.createObjectStore('cards', {
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

      const transaction = this.cardDatabase.db.transaction(['cards'], 'readwrite')
      const objectStore = transaction.objectStore('cards')
      const addRequest = objectStore.add(newItem)

      // What is the difference between success and complete?
      addRequest.addEventListener('success', () => {})

      transaction.addEventListener('complete', () => {
        console.log('Transaction completed: database modification finished.')
        this.loadCardsFromDatabase()
      })

      /* transaction.addEventListener('error', () => {
       *   this.error = 'Unable to save cards to database'
       * }) */
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
    this.bus.on('deck-edit-card', this.deckEditCard)
    this.bus.on('highlight-card', this.highlightCard)
    this.bus.on('select-deck', this.selectDeck)
    this.bus.on('toggle-card-lock', this.toggleCardLock)
  },
}
</script>


<style scoped>
.deck-manager {
  max-height: 100vh;
  overflow: hidden;
}

.column {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.cards-column {
  max-width: 15em;
}

.filters-column {
  max-width: 30em;
}
</style>
