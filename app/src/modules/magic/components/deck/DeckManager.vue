<template>
  <b-container class="deck-manager">
    <b-row>

      <b-col class="d-none">
        <DeckList :decks="decks" />
      </b-col>

      <b-col>
        <CardList :cards="cards" />
      </b-col>

      <b-col>

      </b-col>

    </b-row>
  </b-container>
</template>


<script>
import axios from 'axios'

// import deckUtil from '../../util/deckUtil.js'

import testDeck from './test_deck.js'

import CardList from './CardList'
import DeckList from './DeckList'

export default {
  name: 'DeckManager',

  components: {
    CardList,
    DeckList,
  },

  data() {
    return {
      actor: this.$store.getters['auth/user'],
      cards: [],
      decks: [testDeck],
    }
  },

  methods: {
    async fetchAllCards() {
      console.log('fetching card data')
      const requestResult = await axios.post('/api/card/all')
      console.log('card data fetched')

      if (requestResult.data.status === 'success') {
        this.cards = requestResult.data.cards
      }
      else {
        alert('Error loading game data')
      }
    },

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
  },

  async mounted() {
    await this.fetchAllCards()
    // await this.fetchAllDecks()
    // console.log(deckUtil.deckListToCardNames(testDeck.decklist))
  },
}
</script>


<style scoped>
</style>
