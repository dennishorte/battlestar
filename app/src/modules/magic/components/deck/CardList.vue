<template>
  <div>
    <div class="search-row">
      <input v-model="searchPrefix" class="form-control" placeholder="search" />
      <button class="btn btn-outline-secondary" @click="randomCard" title="Random card">
        <i class="bi bi-shuffle" />
      </button>
    </div>
    <div class="card-list">
      <div class="card-list-row" v-for="card in searchedCards.slice(0, 1000)" :key="card._id">
        <i class="bi bi-box" v-if="card.isCubeCard()" />
        <CardListItem
          :card="card"
          :separate-faces="true"
          @click="$emit('card-clicked', card)"
        />
      </div>

      <div v-if="searchedCards.length >= 1000" class="alert alert-warning">
        For performance reasons, only 1000 cards are included in this list. Use the filters to reduce the card search space. There are currently {{ this.searchedCards.length }} cards based on the input name.
      </div>
    </div>
  </div>
</template>


<script>
import { util } from 'battlestar-common'

import CardListItem from '../CardListItem.vue'

export default {
  name: 'CardList',

  components: {
    CardListItem,
  },

  emits: ['card-clicked', 'random-card'],

  props: {
    cardlist: {
      type: Array,
      required: true
    },
    filters: {
      type: Array,
      required: true
    },
  },

  data() {
    return {
      searchPrefix: '',
    }
  },

  methods: {
    randomCard() {
      if (this.searchedCards.length === 0) {
        return
      }
      const index = Math.floor(Math.random() * this.searchedCards.length)
      this.$emit('random-card', this.searchedCards[index])
    },
  },

  computed: {
    cardsByName() {
      const groupedCards = util.array.groupBy(this.cardlist, (card) => card.name())

      // Pre-compute unique implementations for each card name
      const uniqueImplementationsByName = {}

      Object.keys(groupedCards).forEach(name => {
        const cardsWithSameName = groupedCards[name]
        const uniqueImplementations = []

        cardsWithSameName.forEach(card => {
          const hasSameImplementation = uniqueImplementations.some(existingCard =>
            card.same(existingCard)
          )

          if (!hasSameImplementation) {
            uniqueImplementations.push(card)
          }
        })

        uniqueImplementationsByName[name] = uniqueImplementations
      })

      return uniqueImplementationsByName
    },

    cardNames() {
      return Object.keys(this.cardsByName).sort()
    },

    searchedNames() {
      return this
        .cardNames
        .filter(cardName => cardName.toLowerCase().includes(this.searchPrefix.toLowerCase()))
    },

    searchedCards() {
      const uniqueCards = []

      this.searchedNames.forEach(name => {
        uniqueCards.push(...this.cardsByName[name])
      })

      return uniqueCards.filter(card => card.matchesFilters(this.filters))
    },
  },
}
</script>


<style scoped>
.search-row {
  display: flex;
  gap: 0.25em;
}

.card-list {
  display: flex;
  flex-direction: column;
  font-size: .8em;
  max-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.card-list-row {
  display: flex;
  flex-direction: row;
}
</style>
