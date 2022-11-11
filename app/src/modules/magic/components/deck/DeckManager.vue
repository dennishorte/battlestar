<template>
  <div v-if="cardsLoaded" class="container-fluid deck-manager">
    <div class="row flex-nowrap">

      <div class="col column filters-column">
        <DeckSelector />
        <CardFilters />
      </div>

      <div class="col column cards-column">
        <button class="btn btn-sm btn-info" @click="updateLocalCards">update local database</button>

        <CardList />
      </div>

      <div class="col column">
        <DeckList v-if="activeDeck" />
      </div>

    </div>

    <CardManagerModal />
  </div>

  <div v-else class="alert alert-warning">Loading card data</div>
</template>


<script>
import { computed } from 'vue'
import { mapState } from 'vuex'

import axios from 'axios'
import mitt from 'mitt'

import CardFilters from './CardFilters'
import CardList from './CardList'
import CardManagerModal from './CardManagerModal'
import DeckList from './DeckList'
import DeckSelector from './DeckSelector'

export default {
  name: 'DeckManager',

  components: {
    CardFilters,
    CardList,
    CardManagerModal,
    DeckList,
    DeckSelector,
  },

  data() {
    return {
      actor: this.$store.getters['auth/user'],
    }
  },

  computed: {
    ...mapState('magic/dm', {
      activeDeck: 'activeDeck',
      cardsLoaded: state => state.cardDatabase.loaded,
      decks: 'decks',
      managedCard: 'managedCard',
    })
  },

  methods: {
    deckEditCard(card) {
      this.editingCard = card
      this.$modal('card-manager-modal').show()
    },


    ////////////////////////////////////////////////////////////////////////////////
    // Deck Fetching Methods

    async fetchAllDecks() {
      const requestResult = await axios.post('/api/user/decks', {
        userId: this.actor._id,
      })

      if (requestResult.data.status === 'success') {
        this.decks = requestResult.data.decks
      }
      else {
        alert('Error loading game data')
      }
    },
  },

  created() {
    this.$store.dispatch('magic/dm/loadCardDatabase')
    this.$store.dispatch('magic/dm/fetchDecks')
  },
}
</script>


<style scoped>
.deck-manager {
  max-height: 100vh;
  overflow-x: scroll;
  overflow-y: hidden;
}

.column {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.cards-column {
  max-width: 15em;
}

.filters-column {
  max-width: 30em;
}
</style>
