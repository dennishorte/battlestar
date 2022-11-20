<template>
  <input v-model="searchPrefix" class="form-control" placeholder="search" />
  <div class="card-list">
    <CardListItem
      v-for="card in searchedCards"
      :card="card"
      @click="highlightCard(card.name)"
    />

    <div class="alert alert-warning">
      For performance reasons, only 1000 cards are included in this list. Use the filters to reduce the card search space.
    </div>
  </div>
</template>


<script>
import axios from 'axios'

import { mapState } from 'vuex'
import { util } from 'battlestar-common'

import CardListItem from './CardListItem'

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
    ...mapState('magic/cards', {
      cardLookup: 'lookup',
    }),

    searchedCards() {
      return this.searchedNames.map(name => this.cardLookup[name.toLowerCase()][0])
    },

    searchedNames() {
      const searchText = this.searchPrefix.toLowerCase()
      const cardNames = util.array.distinct(this.cardlist.map(c => c.name)).sort()
      const searchedNames = cardNames
        .filter(name => name.toLowerCase().includes(searchText))
        .slice(0,1000)
      return searchedNames
    },
  },

  methods: {
    highlightCard(name) {
      const card = this.cardlist.find(c => c.name === name)
      this.$store.dispatch('magic/dm/manageCard', card)
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
  overflow-y: scroll;
}
</style>
