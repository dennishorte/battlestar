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

  props: {
    decks: Array,  // Each deck will be an object as stored in MongoDB.
  },

  methods: {
    selectDeck(deck) {
      this.$store.dispatch('magic/dm/selectDeck', deck)
    },
  },
}
</script>


<style scoped>
</style>
