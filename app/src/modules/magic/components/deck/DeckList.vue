<template>
  <div class="deck-list">
    Deck List

    <div v-for="deck in decks" :key="deck._id" class="deck">
      {{ deck.name }}
    </div>
  </div>
</template>


<script>
export default {
  name: 'DeckList',

  props: {
    decks: Array,  // Each deck will be an object as stored in MongoDB.
  },
}
</script>


<style scoped>
</style>
