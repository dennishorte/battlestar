<template>
  <div class="deck-list">
    <h4>{{ deck.name }}</h4>

    <template v-for="sortType in sortTypes">
      <div v-if="sortedMaindeck[sortType]" class="maindeck deck-section">
        <h5 class="deck-section-header">{{ sortType }}</h5>
        <div v-for="data in sortedMaindeck[sortType]" class="card-and-count">
          <div class="card-count">{{ data.count }}</div>
          <DeckListCard :cardId="data.name" />
        </div>
      </div>
    </template>

    <div v-if="cardData.side" class="sideboard deck-section">
      <h5 class="deck-section-header">Sideboard</h5>
      <div v-for="card in cardData.side" class="card-and-count">
        <div class="card-count">{{ card.count }}</div>
        <DeckListCard :cardId="card.name" />
      </div>
    </div>

    <div v-if="cardData.command" class="command deck-section">
      <h5 class="deck-section-header">Command</h5>
      <div v-for="card in cardData.command" class="card-and-count">
        <div class="card-count">{{ card.count }}</div>
        <DeckListCard :cardId="card.name" />
      </div>
    </div>

  </div>
</template>


<script>
import DeckListCard from './DeckListCard'

import cardUtil from '../../util/cardUtil.js'
import deckUtil from '../../util/deckUtil.js'

export default {
  name: 'DeckList',

  components: {
    DeckListCard,
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
  overflow-y: scroll;
}

.card-and-count {
  display: flex;
  flex-direction: row;
}

.card-count {
  margin-right: .25em;
}

.deck-section {
  font-size: .8em;
}
</style>
