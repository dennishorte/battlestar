<template>
  <MagicWrapper>
    <div class="container-fluid deck-manager">
      <div class="row flex-nowrap">

        <div class="col column filters-column">
          <MagicMenu />
          <MagicFileManager
            class="deck-selector"
            :filelist="deckfiles"
            @selection-changed="selectionChanged"
          />
          <CardFilters :cardlist="cardlist" v-model="filteredCards" />
        </div>

        <div class="col column cards-column">
          <button class="btn btn-sm btn-info" @click="updateLocalCards">update local database</button>

          <CardList :cardlist="filteredCards" />
        </div>

        <div class="col column">
          <Decklist v-if="activeDeck" />
        </div>

      </div>

      <CardManagerModal :cardlist="filteredCards" />
    </div>
  </MagicWrapper>
</template>


<script>
import { computed } from 'vue'
import { mapState } from 'vuex'

import axios from 'axios'
import mitt from 'mitt'

import CardFilters from './CardFilters'
import CardList from './CardList'
import CardManagerModal from './CardManagerModal'
import Decklist from './Decklist'
import MagicFileManager from '../MagicFileManager'
import MagicMenu from '../MagicMenu'
import MagicWrapper from '../MagicWrapper'

export default {
  name: 'DeckManager',

  components: {
    CardFilters,
    CardList,
    CardManagerModal,
    Decklist,
    MagicFileManager,
    MagicMenu,
    MagicWrapper,
  },

  data() {
    return {
      actor: this.$store.getters['auth/user'],
      filteredCards: []
    }
  },

  computed: {
    ...mapState('magic/cards', {
      cardlist: 'cardlist',
    }),

    ...mapState('magic/dm', {
      activeDeck: 'activeDeck',
    }),

    ...mapState('magic/file', {
      filelist: 'filelist',
    }),

    deckfiles() {
      return this.filelist.filter(file => file.kind === 'deck')
    },
  },

  methods: {
    deckEditCard(card) {
      this.editingCard = card
      this.$modal('card-manager-modal').show()
    },

    selectionChanged(event) {
      if (event.newValue.objectType === 'file') {
        this.$store.dispatch('magic/dm/selectDeck', event.newValue.file)
      }
    },

    async updateLocalCards() {
      this.$store.dispatch('magic/cards/updateCardDatabase')
    },
  },
}
</script>


<style scoped>
.deck-manager {
  max-height: 100vh;
  overflow-x: scroll;
  overflow-y: hidden;
}

.deck-selector {
  border: 1px solid darkgray;
  background-color: var(--bs-light);
  border-radius: .25em;
  margin-top: .25em;
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
  min-width: 400px;
  max-width: 30em;
}
</style>
