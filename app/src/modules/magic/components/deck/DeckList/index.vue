<template>
  <div class="deck-list" :class="deck.isModified() ? 'modified' : ''">
    <div class="header">
      <button :disabled="!deck.isModified()" class="btn btn-primary save-button" @click="saveChanges">save</button>
      <DropdownMenu :notitle="true">
        <DropdownButton @click="openDeckSettings">settings</DropdownButton>
        <DropdownButton @click="goToDeckBuilder">deck builder</DropdownButton>
        <DropdownButton @click="openImportModal">load decklist</DropdownButton>
        <DropdownButton @click="downloadDecklist" :disabled="true">export</DropdownButton>
        <DropdownDivider />
        <DropdownButton @click="sort('card-type')">sort: card type</DropdownButton>
        <DropdownButton @click="sort('mana-value')">sort: mana value</DropdownButton>
      </DropdownMenu>
      <div class="deck-name me-2">{{ deck.name }} ({{ maindeckSize }})</div>
    </div>

    <div class="deck-sections">
      <DecklistSection
        v-for="section in sections"
        :key="section.id"
        :cards="section.cards"
        :name="section.name"
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
  name: 'DeckList',

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
      sortStyle: 'card-type',
      sortTypes: [
        'creature',
        'planeswalker',
        'enchantment',
        'artifact',
        'instant',
        'sorcery',
        'other',
        'land',
      ],
    }
  },

  computed: {
    maindeckSize() {
      return this.deck.cardIdsByZone['main'].length
    },

    sections() {
      if (this.sortStyle === 'card-type') {
        const mainZones = {}
        for (const key of this.sortTypes) {
          mainZones[key] = {
            id: this.deck.name + '|' + key,
            name: key,
            cards: [],
          }
        }

        const mainCards = this.deck.cardlist('main')
        for (const card of mainCards) {
          let matched = false

          for (const cardType of this.sortTypes) {
            const filter = {
              kind: 'type',
              value: cardType,
              operator: 'and',
            }

            if (card.matchesFilters([filter])) {
              mainZones[cardType].cards.push(card)
              matched = true
              break
            }
          }

          if (!matched) {
            mainZones['other'].cards.push(card)
          }
        }

        const output = Object.values(mainZones)
        output.push({
          id: this.deck.name + '|sideboard',
          name: 'sideboard',
          cards: this.deck.cardlist('side'),
        })
        output.push({
          id: this.deck.name + '|command',
          name: 'command zone',
          cards: this.deck.cardlist('command'),
        })
        return output.filter(x => x.cards.length > 0)
      }
      else {
        const output = []
        for (const zoneName of this.deck.zones()) {
          output.push({
            id: this.deck.name + '|' + zoneName,
            name: zoneName,
            cards: this.deck.cardlist(zoneName),
          })
        }
        return output
      }
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

    goToDeckBuilder() {
      this.$router.push(`/magic/deck/${this.deck._id}`)
    },

    handleSettingsUpdated() {
      // Settings were updated in the modal directly on the deck object
      // Mark deck as modified so it can be saved
      this.deck.markModified()
    },

    importDecklist(update) {
      // Clear existing cards from all zones
      for (const zone of this.deck.zones()) {
        const cards = [...this.deck.cardlist(zone)]
        for (const card of cards) {
          this.deck.removeCard(card, zone)
        }
      }

      // Add imported cards (already expanded by parseCardlist, one item per copy)
      for (const item of update.insert) {
        this.deck.addCard(item.card, item.zone || 'main')
      }
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

    sort(style) {
      this.sortStyle = style
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
