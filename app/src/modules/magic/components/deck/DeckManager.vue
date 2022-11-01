<template>
  <div class="container deck-manager">
    <div class="row">

      <div class="col d-none">
        <DeckList :decks="decks" />
      </div>

      <div class="col">
        <CardList :cards="cards" />
      </div>

      <div class="col">
        <Card :card="highlightedCard" />
      </div>

    </div>
  </div>
</template>


<script>
import axios from 'axios'
import mitt from 'mitt'

// import deckUtil from '../../util/deckUtil.js'

import testCard from './test_card.js'
import testDeck from './test_deck.js'

import Card from '../Card'
import CardList from './CardList'
import DeckList from './DeckList'

export default {
  name: 'DeckManager',

  components: {
    Card,
    CardList,
    DeckList,
  },

  data() {
    return {
      actor: this.$store.getters['auth/user'],
      bus: mitt(),
      cards: [],
      decks: [testDeck],

      highlightedCard: testCard,
    }
  },

  provide() {
    return {
      bus: this.bus,
    }
  },

  methods: {
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

    highlightCard(card) {
      this.highlightedCard = card
    },
  },

  mounted() {
    this.bus.on('highlight-card', this.highlightCard)
  },
}
</script>


<style scoped>
</style>
