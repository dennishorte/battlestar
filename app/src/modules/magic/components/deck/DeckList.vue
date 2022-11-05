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
        v-if="cardData.side"
        :cards="cardData.side"
        name='sideboard'
      />

      <DeckListSection
        v-if="cardData.command"
        :cards="cardData.command"
        name='command'
      />
    </div>

  </div>
</template>


<script>
import DeckListSection from './DeckListSection'

import cardUtil from '../../util/cardUtil.js'
import deckUtil from '../../util/deckUtil.js'

export default {
  name: 'DeckList',

  components: {
    DeckListSection,
  },

  inject: ['cardLookup'],

  props: {
    deck: Object,
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
    cardData() {
      const data = deckUtil.deckListToCardNames(this.deck.decklist)
      for (const list of Object.values(data)) {
        for (const nameAndCount of list) {
          const cards = this.cardLookup[nameAndCount.name]
          nameAndCount.card = cards ? cards[0] : null
        }
      }
      return data
    },

    sortedMaindeck() {
      const sorted = {}
      for (const data of this.cardData.main) {
        const sortType = cardUtil.getSortType(data.card)
        if (sortType in sorted) {
          sorted[sortType].push(data)
        }
        else {
          sorted[sortType] = [data]
        }
      }
      return sorted
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
  max-height: 100%;
  flex-flow: column wrap;
}
</style>
