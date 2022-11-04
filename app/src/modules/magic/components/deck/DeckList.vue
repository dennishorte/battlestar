<template>
  <div class="deck-list">
    {{ deck.name }}

    <DeckListCard v-for="name in cardNames" :cardName="name" />
  </div>
</template>


<script>
import DeckListCard from './DeckListCard'

import deckUtil from '../../util/deckUtil.js'

export default {
  name: 'DeckList',

  components: {
    DeckListCard,
  },

  props: {
    deck: Object,
  },

  computed: {
    cardNames() {
      return deckUtil.deckListToCardNames(this.deck.decklist).main
    }
  },
}
</script>


<style scoped>
</style>
