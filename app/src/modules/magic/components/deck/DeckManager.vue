<template>
  <div class="deck-manager">
    Deck Manager
  </div>
</template>


<script>
import axios from 'axios'

import deckUtil from '../../util/deckUtil.js'

import testDeck from './test_deck.js'

export default {
  name: 'DeckManager',

  data() {
    return {
      actor: this.$store.getters['auth/user'],
      decks: [],
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
    }
  },

  async mounted() {
    // await this.fetchAllDecks()
    console.log(deckUtil.deckListToCardNames(testDeck.decklist))
  },
}
</script>


<style scoped>
</style>
