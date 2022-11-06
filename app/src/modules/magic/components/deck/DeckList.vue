<template>
  <div class="deck-list">
    <div class="deck-name">{{ deck.name }}</div>

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
</style>
