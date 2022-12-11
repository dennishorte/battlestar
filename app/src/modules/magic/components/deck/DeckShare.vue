<template>
  <div class="deck-share" v-if="deck">
    <MagicMenu />

    <Decklist :deck="deck" :no-menu="true" />
  </div>
</template>


<script>
import axios from 'axios'
import { mag } from 'battlestar-common'

import Decklist from './Decklist'
import MagicMenu from '../MagicMenu'

export default {
  name: 'DeckShare',

  components: {
    Decklist,
    MagicMenu,
  },

  data() {
    return {
      deck: null,
      id: this.$route.params.id,
    }
  },

  async mounted() {
    const requestResponse = await axios.post('/api/magic/deck/fetch', {
      deckId: this.id
    })
    if (requestResponse.data.status === 'success') {
      const deck = mag.util.deck.deserialize(requestResponse.data.deck)
      const lookupFunc = this.$store.getters['magic/cards/getLookupFunc']
      mag.util.card.lookup.insertCardData(deck.cardlist, lookupFunc)
      this.deck = deck
    }
    else {
      console.log(requestResponse)
      alert('Error loading deck')
    }
  },
}
</script>
