<template>
  <input v-model="searchPrefix" class="form-control" placeholder="search" />
  <div class="card-list">
    <CardListItem
      v-for="card in searchedCards.slice(0, 1000)"
      :card="card"
      :separateFaces="true"
    />

    <div v-if="searchedCards.length >= 1000" class="alert alert-warning">
      For performance reasons, only 1000 cards are included in this list. Use the filters to reduce the card search space. There are currently {{ this.searchedCards.length }} cards based on the input name.
    </div>
  </div>
</template>


<script>
import { util } from 'battlestar-common'

import CardListItem from '../CardListItem'

export default {
  name: 'CardList',

  components: {
    CardListItem,
  },

  props: {
    cardlist: Array,
  },

  data() {
    return {
      searchPrefix: '',
    }
  },

  computed: {
    cardsByName() {
      return util.array.groupBy(this.cardlist, (card) => card.name())
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
      return this.searchedNames.map(name => this.cardsByName[name][0])
    },
  },
}
</script>


<style scoped>
.card-list {
  display: flex;
  flex-direction: column;
  font-size: .8em;
  max-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
