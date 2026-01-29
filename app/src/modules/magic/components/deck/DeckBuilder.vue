<template>
  <MagicWrapper>
    <div class="container-fluid deck-manager">
      <div class="row flex-nowrap">

        <div class="col column filters-column">
          <MagicMenu />
          <CardFilters layout-direction="column" @filters-updated="updateCardFilters"/>
        </div>

        <div class="col column cards-column">
          <CardList :cardlist="cardlist" :filters="filters" @card-clicked="cardlistClicked" />
        </div>

        <div class="col column deck-column">
          <DeckList v-if="deck" :deck="deck" />
          <div v-else class="alert alert-warning">No deck selected</div>
        </div>

      </div>
    </div>

  </MagicWrapper>
</template>


<script>
import { mapState } from 'vuex'

import mitt from 'mitt'

import CardFilters from '../CardFilters.vue'
import CardList from './CardList.vue'
import DeckList from './DeckList/index.vue'
import MagicMenu from '../MagicMenu.vue'
import MagicWrapper from '../MagicWrapper.vue'

export default {
  name: 'DeckBuilder',

  components: {
    CardFilters,
    CardList,
    DeckList,
    MagicMenu,
    MagicWrapper,
  },

  data() {
    return {
      bus: mitt(),
      actor: this.$store.getters['auth/user'],

      filters: [],
      deck: null,
    }
  },

  provide() {
    return {
      actor: this.actor,
      bus: this.bus,
    }
  },

  computed: {
    ...mapState('magic/cards', {
      cardLookup: 'cards',
      cardsReady: 'cardsReady',
    }),

    cardlist() {
      return this.cardLookup.array
    },
  },

  methods: {
    cardlistClicked(card) {
      this.deck.addCard(card, 'main')
    },

    async loadDeck() {
      if (!this.cardsReady) {
        return
      }

      this.deck = await this.$store.dispatch('magic/loadDeck', this.$route.params.id)
    },

    async saveDeck() {
      await this.$post('/api/magic/deck/save', { deck: this.deck })
    },

    updateCardFilters(filters) {
      this.filters = filters
    },
  },

  watch: {
    cardsReady() {
      this.loadDeck()
    },
  },

  mounted() {
    this.loadDeck()
  },
}
</script>


<style scoped>
.deck-manager {
  max-height: 100vh;
  overflow-x: auto;
  overflow-y: hidden;
}

.deck-selector {
  border: 1px solid darkgray;
  background-color: var(--bs-light);
  border-radius: .25em;
  margin-top: .25em;
  min-height: 15em;
}

.column {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.cards-column {
  max-width: 15em;
}

.deck-column {
  max-height: 95vh;
}

.filters-column {
  min-width: 400px;
  max-width: 30em;
  overflow-y: auto;
}
</style>
