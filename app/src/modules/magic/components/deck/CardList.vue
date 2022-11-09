<template>
  <input v-model="cardSearch" class="form-control" placeholder="search" />
  <div class="card-list">
    <div v-for="name in searchedNames" :key="name" class="game-card" @click="highlightCard(name)">
      {{ name }}
    </div>
  </div>
</template>


<script>
import axios from 'axios'

import { mapState } from 'vuex'
import { util } from 'battlestar-common'


export default {
  name: 'CardList',

  data() {
    return {
      cardSearch: '',
      filters: [],
    }
  },

  computed: {
    ...mapState('magic/dm', {
      allcards: state => state.cardDatabase.cards,
      filteredCards: 'filteredCards',
    }),

    cardNames() {
      return util.array.distinct(this.filteredCards.map(c => c.name)).sort()
    },

    searchedNames() {
      const searchText = this.cardSearch.toLowerCase()
      return this
        .cardNames
        .filter(name => name.toLowerCase().includes(searchText))
        .slice(0,1000)
    }
  },

  methods: {
    highlightCard(name) {
      const card = this.filteredCards.find(c => c.name === name)
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

.game-card {
  white-space: nowrap;
  overflow: hidden;
  min-height: 1.4em;
}
</style>
