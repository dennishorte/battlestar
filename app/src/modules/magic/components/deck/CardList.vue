<template>
  <input v-model="searchPrefix" class="form-control" placeholder="search" />
  <div class="card-list">
    <div v-for="name in searchedNames" :key="name" class="game-card" @click="highlightCard(name)">
      {{ name }}
    </div>
    <div class="alert alert-warning">
      For performance reasons, only 1000 cards are included in this list. Use the filters to reduce the card search space.
    </div>
  </div>
</template>


<script>
import axios from 'axios'

import { mapState } from 'vuex'
import { util } from 'battlestar-common'


export default {
  name: 'CardList',

  computed: {
    ...mapState('magic/dm', {
      allcards: state => state.cardDatabase.cards,
      filteredCards: 'filteredCards',
      // searchedNames: state => state.cardList.searchedNames,
    }),

    searchPrefix: {
      get() {
        return this.$store.state.magic.dm.cardList.searchPrefix
      },

      set(value) {
        this.$store.commit('magic/dm/setSearchPrefix', value)
      },
    },

    cardNames() {
      return util.array.distinct(this.filteredCards.map(c => c.name)).sort()
    },

    searchedNames() {
      const searchText = this.searchPrefix.toLowerCase()
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
