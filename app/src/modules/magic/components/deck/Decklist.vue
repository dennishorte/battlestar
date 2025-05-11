<template>
  <div class="deck-list" :class="deck.isModified() ? 'modified' : ''">
    <div class="header">
      <button :disabled="!deck.isModified()" class="btn btn-primary save-button" @click="saveChanges">save</button>
      <DropdownMenu :notitle="true">
        <DropdownButton @click="openDeckSettings">settings</DropdownButton>
        <DropdownButton @click="openImportModal" :disabled="true">load decklist</DropdownButton>
        <DropdownButton @click="downloadDecklist" :disabled="true">export</DropdownButton>
      </DropdownMenu>
      <div class="deck-name me-2">{{ deck.name }} ({{ maindeckSize }})</div>
    </div>

    <div class="deck-sections">
      <DecklistSection
        v-for="section in deck.zones()"
        :key="section"
        :cards="deck.cards(section)"
        :name="section"
        class="deck-section"
        @card-clicked="cardClicked"
      />
    </div>

    <CardManagerModal :deck="deck" />
    <DeckImportModal @import-card-updates="importDecklist" />
    <DeckSettingsModal
      v-if="deck"
      ref="settingsModal"
      :deck="deck"
      @settings-updated="handleSettingsUpdated"
    />

  </div>
</template>


<script>
// import { saveAs } from 'file-saver'

import DecklistSection from './DecklistSection'
import DropdownMenu from '@/components/DropdownMenu'
import DropdownButton from '@/components/DropdownButton'

import CardManagerModal from './CardManagerModal'
import DeckImportModal from './DeckImportModal'
import DeckSettingsModal from './DeckSettingsModal'


export default {
  name: 'Decklist',

  components: {
    DecklistSection,
    DropdownMenu,
    DropdownButton,

    CardManagerModal,
    DeckImportModal,
    DeckSettingsModal,
  },

  props: {
    deck: {
      type: Object,
      required: true
    },
  },

  inject: ['bus'],

  data() {
    return {
      sortTypes: [
        'command',
        'creature',
        'planeswalker',
        'enchantment',
        'artifact',
        'instant',
        'sorcery',
        'other',
        'land',
        'sideboard',
      ],

      viewType: 'card-type',
    }
  },

  computed: {
    maindeckSize() {
      return this.deck.cardIdsByZone['main'].length
    },
  },

  methods: {
    cardClicked(payload) {
      this.bus.emit('card-manager:begin', payload)
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

    handleSettingsUpdated() {
      // Settings were updated in the modal directly on the deck object
      // Mark deck as modified so it can be saved
      this.deck.markModified()
    },

    // eslint-disable-next-line
    importDecklist(update) {
      throw new Error('Not implemented')
    },

    openDeckSettings() {
      this.$refs.settingsModal.showModal()
    },

    openImportModal() {
      this.$modal('deck-import-modal').show()
    },

    async saveChanges() {
      await this.$store.dispatch('magic/saveDeck', this.deck)
    },
  },
}
</script>


<style scoped>
.deck-list {
  display: flex;
  flex-direction: column;
  max-height: 100%;
  font-size: .8em;
  margin-bottom: 4em;
}

.deck-name {
  font-size: 1.5em;
  margin-left: .5em;
}

.deck-section {
  margin-left: 1em;
}

.deck-sections {
  display: flex;
  align-content: flex-start;
  max-height: 100%;
  flex-flow: column wrap;
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.modified {
  background-color: rgb(240, 180, 200);
}
</style>
