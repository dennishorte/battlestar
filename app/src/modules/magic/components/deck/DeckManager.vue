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
          <CardList :cardlist="filteredCards" />
        </div>

        <div class="col column">
          <Decklist v-if="activeDeck" :deck="activeDeck" :modified="modified">
            <template #menu-options>
              <DropdownButton @click="openImportModal">import</DropdownButton>
              <DropdownButton @click="download">export</DropdownButton>
              <DropdownButton @click="openEditModal">edit</DropdownButton>
              <DropdownButton @click="save" :disabled="!modified">save</DropdownButton>
            </template>
          </Decklist>
        </div>

      </div>

    </div>

    <CardManagerModal :cardlist="filteredCards" />

    <Modal id="edit-deck-modal" @ok="edit">
      <template #header>Edit Deck</template>
      <input class="form-control" v-model="newName" placeholder="name" />
      <input class="form-control" v-model="newPath" placeholder="path" />
    </Modal>

    <Modal id="deck-import-modal" @ok="importDecklist">
      <template #header>Import Deck</template>

      <div class="alert alert-danger">
        Using this option will overwrite the existing cards in this deck.
      </div>
      <textarea class="form-control" rows="15" v-model="importText"></textarea>
    </Modal>
  </MagicWrapper>
</template>


<script>
import { computed } from 'vue'
import { mag } from 'battlestar-common'
import { mapState } from 'vuex'

import axios from 'axios'
import mitt from 'mitt'

import CardFilters from './CardFilters'
import CardList from './CardList'
import CardManagerModal from './CardManagerModal'
import Decklist from './Decklist'
import DropdownButton from '@/components/DropdownButton'
import MagicFileManager from '../MagicFileManager'
import MagicMenu from '../MagicMenu'
import MagicWrapper from '../MagicWrapper'
import Modal from '@/components/Modal'

export default {
  name: 'DeckManager',

  components: {
    CardFilters,
    CardList,
    CardManagerModal,
    Decklist,
    DropdownButton,
    MagicFileManager,
    MagicMenu,
    MagicWrapper,
    Modal,
  },

  data() {
    return {
      actor: this.$store.getters['auth/user'],
      filteredCards: [],

      newName: '',
      newPath: '',

      importText: '',
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

    ////////////////////////////////////////////////////////////////////////////////
    // Menu actions

    download() {
      const data = this.deck.decklist
      const blob = new Blob([data], { type: "text/plain;charset=utf-8" })
      saveAs(blob, `${this.deck.name}.txt`)
    },

    async edit() {
      this.deck.name = this.newName.trim()
      this.deck.path = this.newPath.trim()
      this.$store.commit('magic/dm/setDeckName', this.newName)
      this.$store.commit('magic/dm/setDeckPath', this.newPath)
      await this.$store.dispatch('magic/dm/saveActiveDeck')
      await this.$store.dispatch('magic/dm/fetchDecks')
    },

    importDecklist() {
      const cards = mag.util.card.parseCardlist(this.importText)
      this.$store.dispatch('magic/dm/setActiveDecklist', cards)
    },

    openEditModal() {
      this.newName = this.deck.name
      this.newPath = this.deck.path
      this.$modal('edit-deck-modal').show()
    },

    openImportModal() {
      this.$modal('deck-import-modal').show()
    },

    async save() {
      this.$store.dispatch('magic/dm/saveActiveDeck')
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
