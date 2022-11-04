<template>
  <div class="deck-list">
    {{ deck.name }}

    <div v-for="card in cards" class="card-and-count">
      <div>{{ card.count }}</div>
      <DeckListCard :cardId="card.name" />
    </div>

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
    cards() {
      return deckUtil.deckListToCardNames(this.deck.decklist).main
    }
  },
}
</script>


<style scoped>
.card-and-count {
  display: flex;
  flex-direction: row;
}
</style>
