<template>
  <MagicWrapper>
    <div class="container-fluid deck-manager">
      <div class="row flex-nowrap">

        <div class="col column filters-column">
          <MagicMenu />
          <CardFilters
            :cardlist="cardlist"
            v-model="filteredCards"
            @filters-applied="storeFiltersOnDeck"
          />
        </div>

        <div class="col column cards-column">
          <CardList :cardlist="filteredCards" />
        </div>

        <div class="col column deck-column">
          <Decklist
            v-if="activeDeck"
            :deck="activeDeck"
            :modified="modified"
            default-edit-mode="build"
            @card-clicked="manageCard"
          >
            <template #menu-options>
              <DropdownButton @click="openImportModal">import</DropdownButton>
              <DropdownButton @click="download">export</DropdownButton>
              <DropdownButton @click="openEditModal">edit</DropdownButton>
              <DropdownButton @click="save" :disabled="!modified">save</DropdownButton>
              <DropdownButton @click="share">share</DropdownButton>
            </template>
          </Decklist>

          <div v-else class="alert alert-warning">No deck selected</div>
        </div>

      </div>

    </div>

    <CardManagerModal :cardlist="filteredCards" />

    <CardImportModal modal-id="deck-import-modal" @import-card-updates="importDecklist">
      <template #top-slot>
        <div class="alert alert-danger">
          Using this option will overwrite the existing cards in this deck.
        </div>
      </template>
    </CardImportModal>

    <Modal id="edit-deck-modal" @ok="edit">
      <template #header>Edit Deck</template>
      <input class="form-control" v-model="newName" placeholder="name" />
      <input class="form-control" v-model="newPath" placeholder="path" />
    </Modal>

  </MagicWrapper>
</template>


<script>
import { computed } from 'vue'
import { mag } from 'battlestar-common'
import { mapState } from 'vuex'

import mitt from 'mitt'

import CardFilters from '../CardFilters'
import CardList from './CardList'
import CardImportModal from '../CardImportModal'
import CardManagerModal from './CardManagerModal'
import Decklist from './Decklist'
import DropdownButton from '@/components/DropdownButton'
import MagicMenu from '../MagicMenu'
import MagicWrapper from '../MagicWrapper'
import Modal from '@/components/Modal'

export default {
  name: 'DeckManager',

  components: {
    CardFilters,
    CardList,
    CardImportModal,
    CardManagerModal,
    Decklist,
    DropdownButton,
    MagicMenu,
    MagicWrapper,
    Modal,
  },

  data() {
    return {
      bus: mitt(),

      actor: this.$store.getters['auth/user'],
      filteredCards: [],

      newName: '',
      newPath: '',

      importText: '',
    }
  },

  provide() {
    return {
      bus: this.bus,
    }
  },

  computed: {
    ...mapState('magic/cards', {
      cardlist: 'cardlist',
    }),

    ...mapState('magic/dm', {
      activeDeck: 'activeDeck',
      modified: 'modified',
    }),
  },

  methods: {
    deckEditCard(card) {
      this.editingCard = card
      this.$modal('card-manager-modal').show()
    },

    manageCard(card) {
      if (card.data) {
        this.$store.dispatch('magic/dm/manageCard', card.data)
      }
      else {
        this.$store.dispatch('magic/dm/manageCard', card)
      }
    },

    share() {
      this.$router.push(`/magic/deck/${this.activeDeck._id}`)
    },

    storeFiltersOnDeck(filters) {
      this.$store.dispatch('magic/dm/storeFiltersOnDeck', filters)
    },

    ////////////////////////////////////////////////////////////////////////////////
    // Menu actions

    download() {
      const data = this.deck.decklist
      const blob = new Blob([data], { type: "text/plain;charset=utf-8" })
      saveAs(blob, `${this.deck.name}.txt`)
    },

    async edit() {
      this.activeDeck.name = this.newName.trim()
      this.activeDeck.path = this.newPath.trim()
      this.$store.commit('magic/dm/setDeckName', this.newName)
      this.$store.commit('magic/dm/setDeckPath', this.newPath)
      await this.$store.dispatch('magic/dm/saveActiveDeck')
    },

    importDecklist(update) {
      this.$store.dispatch('magic/dm/setActiveDecklist', update.insert)
    },

    openEditModal() {
      this.newName = this.activeDeck.name
      this.newPath = this.activeDeck.path
      this.$modal('edit-deck-modal').show()
    },

    openImportModal() {
      this.$modal('deck-import-modal').show()
    },

    async save() {
      this.$store.dispatch('magic/dm/saveActiveDeck')
    },
  },

  watch: {
    activeDeck(newDeck) {
      if (newDeck.filters) {
        this.bus.emit('card-filters-set', newDeck.filters)
      }
    },
  },

  mounted() {
    if (this.activeDeck && this.activeDeck.filters) {
      this.bus.emit('card-filters-set', this.activeDeck.filters)
    }
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
