<template>
  <div class="deck-list">
    <div class="header">
      <div class="deck-name me-2">{{ deck.name }}</div>

      <div class="header-buttons">
        <button class="btn btn-secondary btn-sm">import</button>
        <button @click="download" class="btn btn-secondary btn-sm">export</button>
        <button class="btn btn-info btn-sm">edit</button>
        <button :disabled="!deck.modified" class="btn btn-warning btn-sm">save</button>
      </div>
    </div>

    <div class="deck-sections">
      <template v-for="sortType in sortTypes">
        <DeckListSection
          v-if="sortedMaindeck[sortType]"
          :cards="sortedMaindeck[sortType]"
          :name="sortType"
        />
      </template>

      <DeckListSection
        v-if="deck.breakdown.side.length"
        :cards="deck.breakdown.side"
        name='sideboard'
      />

      <DeckListSection
        v-if="deck.breakdown.command.length"
        :cards="deck.breakdown.command"
        name='command'
      />
    </div>
  </div>
</template>


<script>
import { util } from 'battlestar-common'
import { saveAs } from 'file-saver'
import { mapState } from 'vuex'

import DeckListSection from './DeckListSection'

import cardUtil from '../../util/cardUtil.js'
import deckUtil from '../../util/deckUtil.js'


export default {
  name: 'DeckList',

  components: {
    DeckListSection,
  },

  data() {
    return {
      sortTypes: [
        'creature',
        'planeswalker',
        'enchantment',
        'artifact',
        'instant',
        'sorcery',
        'other',
        'land',
      ],
    }
  },

  computed: {
    ...mapState('magic/dm', {
      cardLookup: state => state.cardDatabase.lookup,
      deck: 'activeDeck',
    }),

    sortedMaindeck() {
      return util.array.collect(this.deck.breakdown.main, data => cardUtil.getSortType(data.card))
    },
  },

  methods: {
    download() {
      this.deck.updateDecklist()
      const data = this.deck.decklist
      const blob = new Blob([data], { type: "text/plain;charset=utf-8" })
      saveAs(blob, `${this.deck.name}.txt`)
    }
  },
}
</script>


<style scoped>
.deck-list {
  display: flex;
  flex-direction: column;
  max-height: 100%;
  font-size: .8em;
}

.deck-name {
  font-size: 1.5em;
}

.deck-sections {
  display: flex;
  align-content: flex-start;
  max-height: 100%;
  flex-flow: column wrap;
}

.header {
  display: flex;
  flex-direction: row;
}

.header-buttons button {
  margin-left: .25em;
}
</style>
