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

      </div>

    </div>
  </div>
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
    // await this.fetchAllDecks()
    // console.log(deckUtil.deckListToCardNames(testDeck.decklist))
  },
}
</script>


<style scoped>
</style>
