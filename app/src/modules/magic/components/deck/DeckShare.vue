<template>
  <MagicWrapper>
    <div class="deck-share" v-if="deck">
      <MagicMenu />

      <Decklist :deck="deck" :no-menu="true" />
    </div>
  </MagicWrapper>
</template>


<script>
import { mag } from 'battlestar-common'

import Decklist from './Decklist'
import MagicMenu from '../MagicMenu'
import MagicWrapper from '../MagicWrapper'

export default {
  name: 'DeckShare',

  components: {
    Decklist,
    MagicMenu,
    MagicWrapper,
  },

  data() {
    return {
      deck: null,
      id: this.$route.params.id,
    }
  },

  async mounted() {
    const response = await this.$post('/api/magic/deck/fetch', {
      deckId: this.id
    })
    const deck = mag.util.deck.deserialize(response.deck)
    const lookupFunc = this.$store.getters['magic/cards/getLookupFunc']
    mag.util.card.lookup.insertCardData(deck.cardlist, lookupFunc)
    this.deck = deck
  },
}
</script>
