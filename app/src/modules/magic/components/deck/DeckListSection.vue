<template>
  <div class="deck-section">
    <div class="deck-section-header">{{ name }}</div>
    <div v-for="card in cards" class="card-and-count">
      <div class="card-count">{{ card.count }}</div>
      <DeckListCard :cardId="card.name" />
    </div>
  </div>
</template>


<script>
import DeckListCard from './DeckListCard'

import cardUtil from '../../util/cardUtil.js'
import deckUtil from '../../util/deckUtil.js'


export default {
  name: 'DeckListSection',

  components: {
    DeckListCard,
  },

  props: {
    cards: Array,
    name: String,
  },
}
</script>


<style scoped>
.deck-section-header {
  font-size: 1.2em;
  margin-top: 1em;
  margin-left: .25em;
}

.card-and-count {
  display: flex;
  flex-direction: row;
}

.card-count {
  margin-right: .25em;
}
</style>
