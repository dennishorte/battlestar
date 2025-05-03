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
          <Decklist
            v-if="deck"
            :deck="deck"
            @card-clicked="decklistClicked"
          >
            <template #menu-options>
              <DropdownButton @click="openImportModal">import</DropdownButton>
              <DropdownButton @click="downloadDecklist">export</DropdownButton>
              <DropdownButton @click="saveDeck" :disabled="!deck.isModified()">save</DropdownButton>
            </template>
          </Decklist>

          <div v-else class="alert alert-warning">No deck selected</div>
        </div>

      </div>

    </div>

    <CardManagerModal :deck="deck" />
    <DeckImportModal @import-card-updates="importDecklist" />

  </MagicWrapper>
</template>


<script>
import { mapState } from 'vuex'

import mitt from 'mitt'

import UIDeckWrapper from '@/modules/magic/util/deck.wrapper'

import CardFilters from '../CardFilters'
import CardList from './CardList'
import DeckImportModal from './DeckImportModal'
import CardManagerModal from './CardManagerModal'
import Decklist from './Decklist'
import DropdownButton from '@/components/DropdownButton'
import MagicMenu from '../MagicMenu'
import MagicWrapper from '../MagicWrapper'

export default {
  name: 'DeckBuilder',

  components: {
    CardFilters,
    CardList,
    DeckImportModal,
    CardManagerModal,
    Decklist,
    DropdownButton,
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

    decklistClicked(payload) {
      this.bus.emit('card-manager:begin', {
        card: payload.card,
        zone: payload.zone,
      })
    },

    downloadDecklist() {
      throw new Error('Not implemented')
    },

    importDecklist(decklist) {
      throw new Error('Not implemented')
    },

    async loadDeck() {
      if (!this.cardsReady) {
        return
      }

      this.deck = await this.$store.dispatch('magic/loadDeck', this.$route.params.id)
    },

    openImportModal() {
      throw new Error('Not implemented')
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
