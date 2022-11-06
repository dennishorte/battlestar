<template>
  <div class="deck-folder">
    <i class="bi-folder"></i> {{ content.name }}

    <div
      v-for="deck in content.decks"
      @click="selectDeck(deck)"
      class="nested"
    >
      <i class="bi-box"></i> {{ deck.name }}
    </div>
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

  mounted() {
    console.log(this.content)
  },
}
</script>


<style scoped>
.nested {
  margin-left: 1em;
}
</style>
