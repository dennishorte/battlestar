<template>
  <div class="deck-folder">
    <div>
      <i class="bi-folder"></i> {{ content.name }}
    </div>

    <div
      v-for="deck in content.decks"
      @click="selectDeck(deck)"
      class="nested"
    >
      <i class="bi-box"></i> {{ deck.name }}
    </div>

    <DeckFolder v-for="folder in content.folders" class="nested" :content="folder" />
  </div>
</template>


<script>
export default {
  name: 'DeckFolder',

  props: {
    content: Object,
  },

  methods: {
    selectDeck(deck) {
      this.$store.dispatch('magic/dm/selectDeck', deck)
    },
  },
}
</script>


<style scoped>
.nested {
  margin-left: 1em;
}
</style>
