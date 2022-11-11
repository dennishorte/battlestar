<template>
  <div class="deck-folder">
    <div @click="selectFolder(content.pwd)" class="folder-name" :class="folderClasses">
      <i class="bi-folder"></i>
      {{ content.name }}
    </div>

    <div
      v-for="deck in content.decks"
      :key="deck._id"
      @click="selectDeck(deck)"
      class="nested deck-name"
      :class="deckClasses(deck)"
    >
      <i class="bi-box"></i> {{ deck.name }}
    </div>

    <DeckFolder v-for="folder in content.folders" class="nested" :content="folder" />
  </div>
</template>


<script>
import { mapState } from 'vuex'


export default {
  name: 'DeckFolder',

  props: {
    content: Object,
  },

  computed: {
    ...mapState('magic/dm', {
      activeDeck: 'activeDeck',
      activeFolder: 'activeFolder',
    }),

    folderClasses() {
      return this.content.pwd === this.activeFolder ? 'selected' : ''
    },
  },

  methods: {
    deckClasses(deck) {
      if (!this.activeDeck) {
        return ''
      }
      return (
        deck.name === this.activeDeck.name
        && deck.pwd === this.activeDeck.pwd
      ) ? 'selected' : ''
    },

    selectDeck(deck) {
      this.$store.dispatch('magic/dm/selectDeck', deck)
    },

    selectFolder(path) {
      this.$store.dispatch('magic/dm/selectFolder', path)
    },
  },
}
</script>


<style scoped>
.deck-name,
.folder-name {
  padding-left: .5em;
}

.nested {
  margin-left: 1em;
}

.selected {
  background-color: lightblue;
  border-radius: .25em;
}
</style>
