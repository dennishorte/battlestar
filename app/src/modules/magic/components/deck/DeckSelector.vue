<template>
  <div class="deck-selector">
    Deck Selector

    <div
      v-for="deck in decks"
      class="deck"
      @click="selectDeck(deck)"
    >
      {{ deck.name }}
    </div>
  </div>
</template>


<script>
export default {
  name: 'DeckSelector',

  inject: ['bus'],

  props: {
    decks: Array,  // Each deck will be an object as stored in MongoDB.
  },

  methods: {
    selectDeck(deck) {
      this.bus.emit('select-deck', deck)
    },
  },
}
</script>


<style scoped>
</style>
